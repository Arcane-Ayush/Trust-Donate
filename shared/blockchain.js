import { ethers } from 'ethers';
import { UGFClient } from '@tychilabs/ugf-testnet-js';
import ABI from './contractABI.json' assert { type: "json" };
import { CONTRACT_ADDRESS, CHAIN_ID } from './config.js';
import { sha256 } from 'js-sha256';

let provider, signer, contract, ugfClient;
export let useUGFFallback = false;

export function setUGFFallback(val) {
  useUGFFallback = val;
}

// shared/blockchain.js — written and maintained by Person 3

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  
  // Force network switch or add to Base Sepolia
  try {
    await provider.send('wallet_switchEthereumChain', [{ chainId: '0x14a34' }]); // 84532 in hex
  } catch (switchError) {
    if (switchError.code === 4902 || switchError?.info?.error?.code === 4902 || switchError?.data?.originalError?.code === 4902) {
      try {
        await provider.send('wallet_addEthereumChain', [{
          chainId: '0x14a34',
          chainName: 'Base Sepolia Testnet',
          rpcUrls: ['https://sepolia.base.org'],
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          blockExplorerUrls: ['https://sepolia.basescan.org']
        }]);
      } catch (addError) {
        console.error("Failed to add Base Sepolia:", addError);
      }
    } else {
      console.error("Please manually switch your MetaMask to Base Sepolia (Chain ID: 84532)");
    }
  }

  signer = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  ugfClient = new UGFClient({ chainId: CHAIN_ID, signer });
  
  const address = await signer.getAddress();
  return { address, shortAddress: address.slice(0, 6) + '...' + address.slice(-4) };
}

async function ensureBaseSepolia() {
  if (!provider) return;
  const network = await provider.getNetwork();
  if (network.chainId !== 84532n) {
    try {
      await provider.send('wallet_switchEthereumChain', [{ chainId: '0x14a34' }]);
      signer = await provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      ugfClient = new UGFClient({ chainId: CHAIN_ID, signer });
    } catch (err) {
      if (err.code === 4902 || err?.info?.error?.code === 4902 || err?.data?.originalError?.code === 4902) {
        try {
          await provider.send('wallet_addEthereumChain', [{
            chainId: '0x14a34',
            chainName: 'Base Sepolia Testnet',
            rpcUrls: ['https://sepolia.base.org'],
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://sepolia.basescan.org']
          }]);
          signer = await provider.getSigner();
          contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          ugfClient = new UGFClient({ chainId: CHAIN_ID, signer });
          return;
        } catch (addError) {
          console.error("Failed to add network", addError);
          throw new Error("Failed to add Base Sepolia to your wallet. Please add it manually.");
        }
      }
      console.error("Failed to switch network before tx", err);
      throw new Error("Please manually switch your wallet to Base Sepolia (Chain ID: 84532) and try again.");
    }
  }
}

export async function donate(amount, category) {
  if (!ugfClient || !contract) throw new Error("Wallet not connected");
  
  await ensureBaseSepolia();
  
  if (useUGFFallback) {
    const tx = await signer.sendTransaction({
      to: CONTRACT_ADDRESS,
      data: contract.interface.encodeFunctionData('donate', [amount, category])
    });
    return tx.hash;
  }

  // 1. Login to UGF
  await ugfClient.auth.login(signer);
  
  const address = await signer.getAddress();
  
  // 2. Get Sponsorship Quote
  const quote = await ugfClient.quote.get({
    payer_address: address,
    tx_object: JSON.stringify({
      to: CONTRACT_ADDRESS,
      data: contract.interface.encodeFunctionData('donate', [amount, category])
    })
  });
  
  // 3. Authorize Mock USD Payment (Gasless Signature)
  await ugfClient.payment.x402.execute({ quote, signer });
  
  // 4. Sponsor Gas and Execute User Tx
  const result = await ugfClient.chains.evm.sponsorAndExecute(
    quote.digest,
    signer,
    async () => ({
      to: CONTRACT_ADDRESS,
      data: contract.interface.encodeFunctionData('donate', [amount, category])
    })
  );
  
  return result.userTxHash;
}

export async function computeInvoiceHash(file) {
  const buffer = await file.arrayBuffer();
  return '0x' + sha256(buffer);
}

export async function recordExpense(amount, category, invoiceHash) {
  if (!ugfClient || !contract) throw new Error("Wallet not connected");
  
  await ensureBaseSepolia();
  
  if (useUGFFallback) {
    const tx = await signer.sendTransaction({
      to: CONTRACT_ADDRESS,
      data: contract.interface.encodeFunctionData('recordExpense', [amount, category, invoiceHash])
    });
    return tx.hash;
  }

  // 1. Login to UGF
  await ugfClient.auth.login(signer);
  
  const address = await signer.getAddress();
  
  // 2. Get Sponsorship Quote
  const quote = await ugfClient.quote.get({
    payer_address: address,
    tx_object: JSON.stringify({
      to: CONTRACT_ADDRESS,
      data: contract.interface.encodeFunctionData('recordExpense', [amount, category, invoiceHash])
    })
  });
  
  // 3. Authorize Mock USD Payment (Gasless Signature)
  await ugfClient.payment.x402.execute({ quote, signer });
  
  // 4. Sponsor Gas and Execute User Tx
  const result = await ugfClient.chains.evm.sponsorAndExecute(
    quote.digest,
    signer,
    async () => ({
      to: CONTRACT_ADDRESS,
      data: contract.interface.encodeFunctionData('recordExpense', [amount, category, invoiceHash])
    })
  );
  
  return result.userTxHash;
}

export async function flagExpense(expenseId) {
  if (!contract) throw new Error("Wallet not connected");
  await ensureBaseSepolia();
  // Flagging is not routed via UGF in the instructions, doing direct call
  const tx = await contract.flagExpense(expenseId);
  await tx.wait();
  return tx.hash;
}

export async function getDonations() {
  if (!contract) throw new Error("Wallet not connected");
  const donations = await contract.getDonations();
  return donations.map(d => ({
    donor: d.donor,
    amount: d.amount.toString(),
    category: d.category,
    timestamp: Number(d.timestamp) * 1000 // Convert to JS ms
  }));
}

export async function getExpenses() {
  if (!contract) throw new Error("Wallet not connected");
  const expenses = await contract.getExpenses();
  return expenses.map(e => ({
    amount: e.amount.toString(),
    category: e.category,
    invoiceHash: e.invoiceHash,
    timestamp: Number(e.timestamp) * 1000,
    flagged: e.flagged
  }));
}

export async function getTotals() {
  if (!contract) throw new Error("Wallet not connected");
  const totals = await contract.getTotals();
  return {
    totalDonated: totals.totalDonated.toString(),
    totalSpent: totals.totalSpent.toString(),
    remaining: totals.remaining.toString()
  };
}
