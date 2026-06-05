# TrustDonate — Developer Setup Guide

This guide is for **Person 2 (Frontend)** and **Person 4 (Integration & Dashboards)** to set up the repository locally and interact with the blockchain layer.

---

## 1. Setup & Installation

Since `package.json` and `package-lock.json` are committed to the repository, you do not need to install dependencies manually.

1. Clone or pull the latest changes from the `main` branch.
2. Navigate to the root directory and run:
   ```bash
   npm install
   ```
   This command automatically installs all the exact package versions we are using, including `ethers`, `@tychilabs/ugf-testnet-js`, and the compiler tools.

---

## 2. Using the Shared Blockchain Layer

You must **NEVER** write raw `ethers.js` or `web3.js` calls in your frontend files. Instead, import the helper functions from `shared/blockchain.js`.

### For Person 2 (Frontend)
Import and use these helpers in `Landing.jsx`, `Donate.jsx`, and `UserDashboard.jsx`:
```javascript
import { connectWallet, donate, getDonations } from '../../shared/blockchain.js';

// 1. Connect User Wallet
const { address, shortAddress } = await connectWallet();

// 2. Perform a Gasless Donation (UGF-powered, pays with Mock USD, NOT ETH)
const txHash = await donate(100, "Food"); // amount, category

// 3. Get Donation History
const donations = await getDonations();
```

### For Person 4 (Integration & Dashboards)
Import and use these helpers in `NGODashboard.jsx`, `PublicDashboard.jsx`, etc.:
```javascript
import { 
  recordExpense, 
  flagExpense, 
  getExpenses, 
  getTotals, 
  computeInvoiceHash 
} from '../../shared/blockchain.js';

// 1. Get Pool Totals
const { totalDonated, totalSpent, remaining } = await getTotals();

// 2. Upload and Hash Invoice PDF (Never upload raw PDF to chain)
const file = fileInput.files[0];
const invoiceHash = await computeInvoiceHash(file);

// 3. Record Expense (NGO Admin Only)
const txHash = await recordExpense(500, "Healthcare", invoiceHash);

// 4. Flag a suspicious expense (Any user)
const txHash = await flagExpense(expenseId);
```

---

## 3. Configuration & Mock Data

- **Contract Details:** The contract configuration is located at `shared/config.js`. Currently, it uses a placeholder contract address.
- **Mocking Strategy:** If you need to test the frontend before the live contract is deployed, use the mock datasets defined in `MASTER_PROMPT.md` directly in your component state.
