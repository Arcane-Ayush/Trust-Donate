// shared/blockchain.js — written and maintained by Person 3 (implemented by Person 2 for now)
import { ethers } from 'ethers';

// Mock data for development
const MOCK_DONATIONS = [
  { donor: '0x1234...5678', amount: '500', category: 'Food', timestamp: Date.now() - 3600000 },
  { donor: '0x5678...1234', amount: '200', category: 'Education', timestamp: Date.now() - 86400000 },
];

export async function connectWallet() {
  console.log("Connecting wallet...");
  // Simulate delay
  await new Promise(r => setTimeout(r, 500));
  const address = '0xABCD1234567890abcdef1234567890ABCDEF1234';
  return { 
    address, 
    shortAddress: address.slice(0,6)+'...'+address.slice(-4) 
  };
}

export async function donate(amount, category) {
  console.log(`Donating ${amount} in category ${category}`);
  await new Promise(r => setTimeout(r, 1000));
  return '0x' + Math.random().toString(16).slice(2, 66);
}

export async function getDonations() {
  return MOCK_DONATIONS;
}

export async function getTotals() {
  return { 
    totalDonated: 700, 
    totalSpent: 400, 
    remaining: 300 
  };
}

export function computeInvoiceHash(file) {
  return '0x' + Math.random().toString(16).slice(2, 66);
}
