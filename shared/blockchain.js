import { ethers } from 'ethers';
import { UGFClient } from '@tychilabs/ugf-testnet-js';
import ABI from './contractABI.json' assert { type: "json" };
import { CONTRACT_ADDRESS, CHAIN_ID } from './config.js';
import { sha256 } from 'js-sha256';

let provider, signer, contract, ugfClient;

// shared/blockchain.js — written and maintained by Person 3

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  
  // Force network switch to Base Sepolia
  try {
    await provider.send('wallet_switchEthereumChain', [{ chainId: '0x14a34' }]); // 84532 in hex
  } catch (switchError) {
    // If the chain hasn't been added yet, you would ideally add it here.
    console.error("Please manually switch your MetaMask to Base Sepolia (Chain ID: 84532)");
  }

  signer = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  ugfClient = new UGFClient({ chainId: CHAIN_ID, signer });
  
  // Polyfill execute method for the hackathon demo
  ugfClient.execute = async ({ to, data }) => {
    const tx = await signer.sendTransaction({ to, data });
    await tx.wait();
    return tx;
  };

  const address = await signer.getAddress();
  return { address, shortAddress: address.slice(0, 6) + '...' + address.slice(-4) };
}

export async function donate(amount, category) {
  if (!ugfClient || !contract) throw new Error("Wallet not connected");
  // Route through UGF — user pays Mock USD not ETH
  const tx = await ugfClient.execute({
    to: CONTRACT_ADDRESS,
    data: contract.interface.encodeFunctionData('donate', [amount, category]),
  });
  return tx.hash;
}

export async function computeInvoiceHash(file) {
  const buffer = await file.arrayBuffer();
  return '0x' + sha256(buffer);
}

export async function recordExpense(amount, category, invoiceHash) {
  if (!ugfClient || !contract) throw new Error("Wallet not connected");
  const tx = await ugfClient.execute({
    to: CONTRACT_ADDRESS,
    data: contract.interface.encodeFunctionData('recordExpense', [amount, category, invoiceHash]),
  });
  return tx.hash;
}

export async function flagExpense(expenseId) {
  if (!contract) throw new Error("Wallet not connected");
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
