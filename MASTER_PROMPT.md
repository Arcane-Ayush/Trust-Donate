# TrustDonate — Master Hackathon Prompt
> Load this file at the start of every AI session. Then say: **"I am Person X"** and the AI will scope all help to your role.

---

## Project Identity

**Name:** TrustDonate  
**Tagline:** A gasless blockchain transparency platform for NGO accountability  
**Chain:** Base Sepolia  
**Gas abstraction:** UGF (Universal Gas Framework) — users pay with Mock USD, never ETH  
**One-line pitch:** "A centralized database can be modified by the NGO or the platform owner. A public blockchain provides an immutable audit trail that any donor can independently verify — we're not replacing payments, we're adding accountability."

---

## What This Project Is (and Is Not)

**IS:** An immutable public audit layer for NGO donations and expenditures.  
**IS NOT:** A payment gateway. Money does not move through this app. It records commitments.  
**IS NOT:** An AI project. Do not add AI features.  
**IS:** A UGF showcase. Every on-chain interaction must go through UGF so no ETH is needed.

When asked "where does the money go?" answer: *"This is an audit layer. For this prototype, we simulate donation settlement while focusing on transparent blockchain record-keeping. Actual UPI/bank integration is future work."*

---

## Core Design Decisions (Non-Negotiable)

| Decision | Rule |
|---|---|
| Auth | Wallet connect only. No username/password. Wallet address = identity. |
| NGO auth | One hardcoded `ADMIN_WALLET` address in the contract. Only it can call `recordExpense()`. |
| Invoices | Store `SHA256(invoice.pdf)` on-chain only. Never upload the PDF itself. |
| Donations | Pool model. Never map individual donor → specific expense. |
| NFT | Optional bonus feature only. Not the main pitch. Frame as "Verifiable Donation Badge." |
| AI | Removed entirely. Do not add it. |

---

## Fraud Resistance (Technical Talking Points for Judges)

**Q: What stops the NGO from recording fake expenses?**

Answer with three layers:

1. **Invoice hash commitment** — The NGO submits `SHA256(invoice.pdf)` on-chain before an expense is accepted. Anyone can later demand the original PDF and verify it hashes to the recorded value. A mismatch is permanently visible on-chain.
2. **Time-lock + flag window** — The contract has a `LOCK_PERIOD` (e.g. 1 day). A `flagExpense(uint expenseId)` function lets any address raise a dispute on-chain within that window. For this prototype it emits a `ExpenseFlagged` event — future work routes it to community review.
3. **Platform-owner cannot hide records** — The public dashboard reads events (`DonationReceived`, `ExpenseRecorded`, `ExpenseFlagged`) directly from the chain via `getDonations()` / `getExpenses()`. Even if we shut down the frontend, the data remains publicly readable on Base Sepolia.

Closing line: *"Blockchain can't verify truthfulness, but it makes falsification permanently visible and publicly auditable. The invoice hash creates a cryptographic commitment — if the NGO can't produce the matching PDF, the fraud is provable on-chain."*

---

## Smart Contract (Source of Truth)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TrustDonate {
    address public admin;
    uint256 public constant LOCK_PERIOD = 1 days;

    struct Donation {
        address donor;
        uint256 amount;
        string  category;
        uint256 timestamp;
    }

    struct Expense {
        uint256 amount;
        string  category;
        string  invoiceHash;   // SHA256 of invoice PDF
        uint256 timestamp;
        bool    flagged;
    }

    Donation[] public donations;
    Expense[]  public expenses;

    event DonationReceived(address indexed donor, uint256 amount, string category, uint256 timestamp);
    event ExpenseRecorded(uint256 amount, string category, string invoiceHash, uint256 timestamp);
    event ExpenseFlagged(uint256 indexed expenseId, address indexed flaggedBy, uint256 timestamp);

    constructor(address _admin) {
        admin = _admin;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    function donate(uint256 amount, string calldata category) external {
        donations.push(Donation(msg.sender, amount, category, block.timestamp));
        emit DonationReceived(msg.sender, amount, category, block.timestamp);
    }

    function recordExpense(uint256 amount, string calldata category, string calldata invoiceHash) external onlyAdmin {
        expenses.push(Expense(amount, category, invoiceHash, block.timestamp, false));
        emit ExpenseRecorded(amount, category, invoiceHash, block.timestamp);
    }

    function flagExpense(uint256 expenseId) external {
        require(expenseId < expenses.length, "Invalid ID");
        require(block.timestamp <= expenses[expenseId].timestamp + LOCK_PERIOD, "Lock period expired");
        expenses[expenseId].flagged = true;
        emit ExpenseFlagged(expenseId, msg.sender, block.timestamp);
    }

    function getDonations() external view returns (Donation[] memory) {
        return donations;
    }

    function getExpenses() external view returns (Expense[] memory) {
        return expenses;
    }

    function getTotals() external view returns (uint256 totalDonated, uint256 totalSpent, uint256 remaining) {
        for (uint i = 0; i < donations.length; i++) totalDonated += donations[i].amount;
        for (uint i = 0; i < expenses.length; i++)  totalSpent   += expenses[i].amount;
        remaining = totalDonated > totalSpent ? totalDonated - totalSpent : 0;
    }
}
```

**Do not add functions beyond these without notifying the whole team.** Person 3 owns this file. All others treat the ABI in `shared/contractABI.json` as read-only.

---

## Shared Blockchain Abstraction Layer

Person 2 and Person 4 must NEVER write raw ethers.js/web3 calls. They call these abstract functions from `shared/blockchain.js`:

```js
// shared/blockchain.js  — written and maintained by Person 3
// Person 2 and 4 import from here, never from ethers directly

export async function connectWallet()           // returns { address, shortAddress }
export async function donate(amount, category)  // UGF-powered, returns txHash
export async function recordExpense(amount, category, invoiceHash)  // admin only
export async function flagExpense(expenseId)    // any wallet
export async function getDonations()            // returns Donation[]
export async function getExpenses()             // returns Expense[]
export async function getTotals()               // returns { totalDonated, totalSpent, remaining }
export function       computeInvoiceHash(file)  // SHA256 of a File object → hex string
```

If Person 3 changes a function signature, they MUST update `PROJECT_STATE.md` and announce it before pushing.

---

## Repository Structure

```
TrustDonate/
│
├── PROJECT_STATE.md          ← READ THIS FIRST every session
├── README.md                 ← Person 1 owns
│
├── frontend/                 ← Person 2 + Person 4
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx        (Person 2)
│   │   │   ├── Donate.jsx         (Person 2)
│   │   │   ├── UserDashboard.jsx  (Person 2)
│   │   │   ├── NGODashboard.jsx   (Person 4)
│   │   │   └── PublicDashboard.jsx(Person 4)
│   │   ├── components/
│   │   │   ├── WalletButton.jsx   (Person 2)
│   │   │   ├── DonationCard.jsx   (Person 2)
│   │   │   ├── ExpenseCard.jsx    (Person 4)
│   │   │   └── StatsPanel.jsx     (Person 4)
│   │   └── App.jsx
│   └── package.json
│
├── contracts/                ← Person 3 ONLY
│   ├── TrustDonate.sol
│   └── deploy.js
│
├── shared/                   ← Person 3 writes, everyone reads
│   ├── blockchain.js         ← THE abstraction layer (see above)
│   ├── contractABI.json      ← auto-generated after deploy, never hand-edit
│   └── config.js             ← CONTRACT_ADDRESS, ADMIN_WALLET, CHAIN_ID
│
└── docs/                     ← Person 1 owns
    ├── architecture.png
    ├── presentation/
    └── screenshots/
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Blockchain | Solidity 0.8.x, Hardhat |
| Network | Base Sepolia testnet |
| Gas abstraction | UGF Testnet SDK (`@tychilabs/ugf-testnet-js`) or `@tychilabs/react-ugf` |
| Wallet | MetaMask |
| Version control | Git + GitHub |

UGF resources:
- Docs: https://universalgasframework.com/docs
- SDK (npm): `@tychilabs/ugf-testnet-js`
- React SDK: `@tychilabs/react-ugf`
- Faucet: https://universalgasframework.com/faucets

---

## Git Workflow

```
main              ← stable, demo-ready at all times
├── blockchain    ← Person 3
├── frontend      ← Person 2
└── dashboard     ← Person 4
```

- Never push directly to `main`.
- Merge only after local test passes.
- Update `PROJECT_STATE.md` with every meaningful change before pushing.
- If you change anything in `shared/`, tag it `[SHARED CHANGE]` in your commit message.

---

## PROJECT_STATE.md (template — Person 3 initialises this)

```md
# PROJECT_STATE.md

## Contract
- Address: 0x... (TBD after deploy)
- Network: Base Sepolia
- Admin wallet: 0x...

## ABI
- Location: shared/contractABI.json
- Last updated: [timestamp]

## Function status
- donate()         ✅ deployed
- recordExpense()  ✅ deployed
- flagExpense()    ✅ deployed
- getDonations()   ✅ deployed
- getExpenses()    ✅ deployed
- getTotals()      ✅ deployed

## Pages
- [ ] Landing             (Person 2)
- [ ] Donate              (Person 2)
- [ ] UserDashboard       (Person 2)
- [ ] NGODashboard        (Person 4)
- [ ] PublicDashboard     (Person 4)

## UGF integration
- [ ] SDK installed
- [ ] donate() wired through UGF
- [ ] recordExpense() wired through UGF

## Known issues / blockers
- None yet

## Last updated by
- [name] at [time]
```

---

## Dashboard Metrics (what to show, nothing more)

| Dashboard | Metrics |
|---|---|
| Public | Total donated · total spent · remaining pool · full transaction feed |
| User | My total donated · my donation history · "part of community fund" note |
| NGO | Available pool · record new expense (amount, category, invoice hash) · expense history with flagged indicator |

Do not invent AI scores, impact ratings, or fancy derived metrics. Show the numbers from the chain.

---

## Presentation Flow (Person 1 reference)

1. **Problem** (30 sec) — donors can't verify where money goes, records can be silently changed.
2. **Solution** (30 sec) — immutable public audit trail on Base Sepolia. Neither we nor the NGO can alter history.
3. **UGF demo** (60 sec) — show wallet with ETH: 0, Mock USD: 100. Perform a donation. Transaction succeeds. This is the headline sponsor moment.
4. **Public dashboard** (30 sec) — show the live feed of donations and expenses anyone can verify.
5. **Fraud resistance** (30 sec) — invoice hash commitment + flag window. Blockchain can't verify truth but makes falsification permanently visible.
6. **NFT badge** (15 sec, if built) — "each donation also mints a verifiable proof-of-contribution badge."
7. **Why blockchain?** — *"A centralized database can be modified by the platform owner. A public blockchain provides an immutable audit trail donors can independently verify."*

Time split: 50% transparency story · 30% UGF / gasless UX · 15% dashboards · 5% NFT badge.

---

## Role Definitions

When you say "I am Person X", the AI will limit all code, suggestions, and explanations to your role below.

---

### Person 1 — Documentation & Presentation Lead

**Your job:** Make sure judges understand and trust the project.  
**You own:** README.md, PPT/slides, architecture diagrams, demo script, GitHub polish, judge Q&A prep, PROJECT_STATE.md updates.  
**You do NOT write:** frontend or blockchain code (unless explicitly asked for a one-off snippet to explain something).

**README must include:**
- One-line pitch
- Problem / Solution / Architecture diagram
- Setup instructions (clone → install → set env vars → run)
- Why blockchain + Why UGF (the exact talking points from this file)
- Team roles
- Future scope

**Judge Q&A to prepare:**
- "Where does the money go?" → audit layer answer
- "What stops fake expenses?" → three-layer fraud answer
- "Why blockchain not a database?" → immutability answer  
- "Why UGF?" → no-ETH answer
- "What's the NFT for?" → proof of donation badge, 5% of pitch

When you say "I am Person 1" the AI will help you write docs, slides, diagrams, and Q&A scripts only.

---

### Person 2 — Frontend Lead

**Your job:** Build the donor-facing UI.  
**You own:** Landing.jsx, Donate.jsx, UserDashboard.jsx, WalletButton.jsx, DonationCard.jsx.  
**You do NOT:** write Solidity, modify blockchain.js, touch contracts/.

**How to call blockchain from your pages:**
```js
import { connectWallet, donate, getDonations } from '../../shared/blockchain.js';

// Connect wallet
const { address, shortAddress } = await connectWallet();

// Donate
const txHash = await donate(amount, category);

// Read history
const donations = await getDonations();
```

**Assume these abstract functions exist and work.** If they don't yet (Person 3 hasn't deployed), use mock data:
```js
const MOCK_DONATIONS = [
  { donor: '0xABCD...1234', amount: 500, category: 'Food', timestamp: Date.now() },
  { donor: '0xABCD...1234', amount: 200, category: 'Education', timestamp: Date.now() - 86400000 },
];
```

**Landing page must show:** hero with one-line pitch, Connect Wallet button, link to Donate, link to Public Dashboard.  
**Donate page must show:** amount input, category selector (Food / Education / Healthcare / Other), UGF balance display (ETH: 0 / Mock USD: 100), Donate button, success state with txHash.  
**User dashboard must show:** wallet address, total donated, list of personal donations, "Your contribution is part of the transparent community fund" note.

When you say "I am Person 2" the AI will only help with these pages and components.

---

### Person 3 — Blockchain Lead

**Your job:** Deploy the contract, wire UGF, publish the ABI, and maintain shared/blockchain.js.  
**You own:** contracts/TrustDonate.sol, contracts/deploy.js, shared/blockchain.js, shared/contractABI.json, shared/config.js.  
**You do NOT:** touch frontend pages or dashboards.

**Deploy checklist:**
- [ ] Install Hardhat: `npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox`
- [ ] Configure Base Sepolia in hardhat.config.js (chainId 84532, RPC: https://sepolia.base.org)
- [ ] Deploy with admin wallet address as constructor argument
- [ ] Copy deployed address into shared/config.js and PROJECT_STATE.md
- [ ] Run `npx hardhat export-abi` or copy ABI manually into shared/contractABI.json
- [ ] Implement and test all functions in shared/blockchain.js against the live contract
- [ ] Install UGF SDK: `npm install @tychilabs/ugf-testnet-js`
- [ ] Wire `donate()` and `recordExpense()` through UGF (not direct MetaMask send)
- [ ] Get Mock USD from faucet: https://universalgasframework.com/faucets
- [ ] Test full flow: connect wallet → donate → verify event on BaseScan

**blockchain.js implementation guide:**
```js
import { ethers } from 'ethers';
import { UGFClient } from '@tychilabs/ugf-testnet-js';
import ABI from './contractABI.json';
import { CONTRACT_ADDRESS, CHAIN_ID } from './config.js';
import { sha256 } from 'js-sha256'; // or SubtleCrypto

let provider, signer, contract, ugfClient;

export async function connectWallet() {
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  signer   = await provider.getSigner();
  contract  = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  ugfClient = new UGFClient({ chainId: CHAIN_ID, signer });
  const address = await signer.getAddress();
  return { address, shortAddress: address.slice(0,6)+'...'+address.slice(-4) };
}

export async function donate(amount, category) {
  // Route through UGF — user pays Mock USD not ETH
  const tx = await ugfClient.execute({
    to: CONTRACT_ADDRESS,
    data: contract.interface.encodeFunctionData('donate', [amount, category]),
  });
  return tx.hash;
}

export async function computeInvoiceHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return '0x' + Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('');
}
// ... implement recordExpense, flagExpense, getDonations, getExpenses, getTotals similarly
```

**Critical:** Announce in PROJECT_STATE.md the moment the contract is deployed. Person 2 and 4 are blocked until they have CONTRACT_ADDRESS and a working blockchain.js.

When you say "I am Person 3" the AI will only help with Solidity, deployment, UGF integration, and shared/blockchain.js.

---

### Person 4 — Integration & Dashboard Lead

**Your job:** Connect the frontend to the live blockchain and build the NGO + public dashboards.  
**You own:** NGODashboard.jsx, PublicDashboard.jsx, ExpenseCard.jsx, StatsPanel.jsx.  
**You do NOT:** write Solidity, modify blockchain.js, or touch contracts/.

**How to call blockchain from your pages:**
```js
import { recordExpense, flagExpense, getExpenses, getDonations, getTotals, computeInvoiceHash } from '../../shared/blockchain.js';

// Get pool totals
const { totalDonated, totalSpent, remaining } = await getTotals();

// Record an expense (NGO admin only)
const invoiceHash = await computeInvoiceHash(fileInput.files[0]);
await recordExpense(amount, category, invoiceHash);

// Flag a suspicious expense
await flagExpense(expenseId);
```

**NGO dashboard must show:** pool summary (total in / total out / remaining), form to record new expense (amount, category, invoice PDF upload → auto-hashed, never sent to chain raw), expense history list with flagged indicator, note explaining admin-wallet-only access.  
**Public dashboard must show:** three stat cards (Total Donated / Total Spent / Remaining Pool), full chronological feed of DonationReceived + ExpenseRecorded + ExpenseFlagged events, each entry showing wallet (shortened), amount, category, timestamp, txHash link to BaseScan.

**Stats calculation (do this in JS, not in the contract):**
```js
const { totalDonated, totalSpent, remaining } = await getTotals();
const donations = await getDonations();
const totalDonors = new Set(donations.map(d => d.donor)).size;
```

**If blockchain.js isn't ready yet**, use this mock:
```js
export const MOCK_TOTALS = { totalDonated: 12500, totalSpent: 8200, remaining: 4300 };
export const MOCK_EXPENSES = [
  { amount: 5000, category: 'Food', invoiceHash: '0xabc...', timestamp: Date.now(), flagged: false },
  { amount: 3200, category: 'Education', invoiceHash: '0xdef...', timestamp: Date.now() - 86400000, flagged: true },
];
```

When you say "I am Person 4" the AI will only help with dashboards, integration, and statistics.

---

## Synchronisation Rules (Everyone)

1. **Read PROJECT_STATE.md before starting any session.**
2. **Update PROJECT_STATE.md after completing any meaningful unit of work.**
3. **Never modify shared/ files except Person 3.**
4. **Never modify contracts/ except Person 3.**
5. **Prefer simple, demo-friendly solutions over production engineering.**
6. **If blocked, write mock data and continue. Do not wait.**
7. **If you change a shared interface, label the commit `[SHARED CHANGE]` and update PROJECT_STATE.md immediately.**

---

## When You Start a Session

Say: **"I am Person X"**

The AI will reply confirming your role and then work strictly within it. If you ask for something outside your role, the AI will flag it and suggest you coordinate with the right person instead.

