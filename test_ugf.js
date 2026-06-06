import { ethers } from 'ethers';
import { UGFClient } from '@tychilabs/ugf-testnet-js';
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
const ABI = JSON.parse(fs.readFileSync('./shared/contractABI.json', 'utf8'));

async function run() {
  try {
    const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const ugfClient = new UGFClient({ chainId: 84532, signer });
    const contract = new ethers.Contract("0xe041C600056c4ac427cE9293aC43c7803e827C82", ABI, signer);

    console.log("Logging in...");
    const token = await ugfClient.auth.login(signer);
    console.log("Logged in! Token:", token.substring(0, 10) + '...');

    console.log("Getting quote via SDK...");
    const quote = await ugfClient.quote.get({
      payer_address: await signer.getAddress(),
      tx_object: JSON.stringify({
        to: "0xe041C600056c4ac427cE9293aC43c7803e827C82",
        data: contract.interface.encodeFunctionData('donate', [100, "Food"])
      })
    });
    
    console.log("Quote received. Executing x402 payment...");
    const payment = await ugfClient.payment.x402.execute({ quote, signer });
    console.log("Vault Payment executed!");
    
    console.log("Sponsoring and executing...");
    const result = await ugfClient.chains.evm.sponsorAndExecute(
      quote.digest,
      signer,
      async () => ({
        to: "0xe041C600056c4ac427cE9293aC43c7803e827C82",
        data: contract.interface.encodeFunctionData('donate', [100, "Food"])
      })
    );
    console.log("Success:", result);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

run();
