# Version 2 Architecture: The Multi-NGO Scaling Roadmap

This document outlines the exact technical requirements to scale TrustDonate from a single-fund prototype into a fully decentralized, multi-NGO ecosystem **without using a centralized database.**

## 1. Decentralized NGO Registry (JSON List)
Instead of a complex Smart Contract Factory, we will use a lightweight, decentralized registry file to track our NGOs.
- **How it works:** A simple `ngos.json` file will act as the master list of all verified NGOs, their specific contract addresses, and their Admin wallets.
- **No Database Needed:** To maintain decentralization, this JSON list will be hosted on **IPFS** (InterPlanetary File System). The frontend will fetch this list on load. Once the frontend knows the contract addresses, it pulls all real-time financial data and histories directly from the blockchain—completely bypassing traditional Web2 databases.

## 2. Decentralized NGO Login & Routing
- **Wallet-Based Authentication:** When a user connects their wallet, the frontend will query the `ngos.json` registry. 
- **Auto-Routing:** If the connected wallet matches a registered NGO's Admin address, the UI will automatically unlock and route them to their dedicated **NGO Admin Portal**. They will manage their own isolated smart contract ledger, ensuring community funds never mix between organizations.

## 3. Dynamic "Donate to a Specific NGO" Flow
- The main `/donate` page will feature an upgraded UI with a "Donate to a specific NGO" search portal.
- **On-Chain Search:** The frontend will pull the list of active NGOs directly from the IPFS registry. Donors can browse, select an NGO, and their transaction will be routed exactly to that specific NGO's smart contract.

## 4. Portfolio-Style User Dashboard
- The User Dashboard will be upgraded from a single feed to a comprehensive **Impact Portfolio**.
- **Unified Ledger:** The frontend will aggregate the user's `DonationReceived` events across *all* the different NGO contracts they have interacted with, displaying a breakdown of their exact impact (e.g., "$50 to Global Education, $20 to Local Healthcare").

---

## 🏗️ Missing Quirks & Edge Cases Addressed

Because we are committing to a 100% decentralized architecture (no databases), we must solve a few unique Web3 challenges:

### Edge Case 1: Expensive Data Storage vs. Absolute Privacy
- **Problem:** Storing heavy metadata (NGO profiles) on-chain is too expensive. Furthermore, uploading sensitive PDF invoices to a public server (or even IPFS) violates the core privacy of the NGO and their vendors.
- **Solution:** For heavy, non-sensitive metadata (like NGO logos), we will use **IPFS**. However, true to our core privacy design, **PDF invoices will never be uploaded anywhere.** We will strictly operate on a hash basis. The NGO calculates the SHA-256 hash locally and only the hash is published on-chain. If an audit is required, the public auditor requests the physical or digital PDF directly from the NGO through private channels, hashes it themselves, and compares it to the immutable blockchain record.

### Edge Case 2: Slow Frontend Search Queries
- **Problem:** As the platform grows to thousands of NGOs, having the React frontend query every single smart contract directly via RPC to build the Explorer page will be extremely slow.
- **Solution:** We will deploy a Subgraph using **The Graph Protocol**. The Graph will index all our blockchain events in real-time, allowing the frontend to use lightning-fast GraphQL queries to build the NGO search page without needing a centralized backend server.

### Edge Case 3: Spam & Fake NGOs
- **Problem:** Because blockchains are permissionless, scammers could freely interact with our platform to list fake NGOs (e.g., "Fake Red Cross") in the JSON registry.
- **Solution:** We will implement an **On-Chain Governance / Curation mechanism**. For an NGO to be added to the official `ngos.json` list, they must either be voted in by a community DAO, or stake a security deposit of tokens that gets slashed if they are caught acting maliciously.

### Edge Case 4: NGO Branding & Naming
- **Problem:** Currently, the platform acts as a single entity ("TrustDonate"). As we onboard more NGOs, users need to know exactly *who* they are donating to.
- **Solution:** The `ngos.json` registry will act as a complete profile database. It will map the NGO's contract address to their official Name, Logo URL, and Description, allowing the UI to dynamically render beautiful, distinct profiles for each organization.

### Edge Case 5: Strict Admin UI Gating
- **Problem:** Right now, the NGO Portal relies on the smart contract's `Ownable` modifier to block unauthorized transactions. However, the UI still allows normal users to *see* the expense forms, which is confusing.
- **Solution:** We will implement **Strict Role Gating**. The frontend will query `contract.owner()` upon connection. If the connected wallet is not the owner, the NGO Portal will render a strict "403 Unauthorized" screen, completely hiding the admin dashboards from public view.

### Edge Case 6: Preventing "Rich Troll" Spam Flagging
- **Problem:** If flagging an expense only costs a small gas fee, a malicious actor (or "rich troll") could spam the `Flag Suspicious` button on legitimate expenses to ruin an NGO's reputation.
- **Solution:** We will implement an **Economic Staking & Slashing** mechanism. To flag an expense, a user must lock up (stake) a deposit (e.g., $50). If a decentralized community DAO investigates and confirms the fraud, the flagger is refunded and rewarded a bounty. However, if the community proves the flagger is a troll (the PDF hash was perfectly valid), the flagger's $50 deposit is **slashed** and donated to the NGO. This game theory makes spam-flagging economically devastating for trolls without ever needing a centralized database.
