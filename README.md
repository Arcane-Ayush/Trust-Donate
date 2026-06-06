# TrustDonate

**TrustDonate** is a gasless, transparent, and immutable blockchain platform built on Base Sepolia. 

**Our Aim:** To eliminate the trust deficit between donors and NGOs. We ensure that every cent donated is tracked, and every expense is cryptographically verified on-chain using the Universal Gas Framework (UGF) so donors never have to pay gas fees.

---

## ⚙️ Developer Setup

Getting the project running locally takes less than a minute.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Arcane-Ayush/Trust-Donate.git
   cd Trust-Donate
   ```

2. **Install dependencies and run the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Note: Ensure you have MetaMask installed in your browser.*

---

## 🗺️ Application Overview

Once the app is running, you can explore the following sections:

### 1. The Donor Portal (`/donate`)
This is where users can effortlessly donate to the community fund. By leveraging the Universal Gas Framework (UGF), donors do not need native ETH to pay for transaction gas. The interface allows users to choose specific allocations (e.g., Food, Education) and commits their contribution to the Base Sepolia blockchain.

### 2. The NGO Admin Dashboard (`/ngo-dashboard`)
A heavily gated dashboard accessible **only** by the smart contract Admin wallet. Here, the NGO records their real-world expenses. Instead of uploading vulnerable PDF receipts to a centralized server, the app calculates a secure, client-side SHA-256 hash of the invoice and permanently locks that hash on-chain.

### 3. The Transparency Audit (`/transparency`)
The core of TrustDonate. This public-facing ledger shows the real-time financial health of the NGO. It lists all incoming donations and outgoing expenses, complete with the immutable cryptographic hashes of the invoice proofs. If any expense looks suspicious, the community can publicly flag it on-chain for auditing.

### 4. Zero-Knowledge Local Verifier
To prove that an NGO's receipt matches the cryptographic hash on Base Sepolia, users can drag and drop a PDF into the in-browser Verifier on the Transparency page. The app calculates the hash locally (the PDF never leaves the browser) and mathematically proves its authenticity by comparing it to the blockchain.

### 5. UGF Polyfix Architecture
If the Universal Gas Framework (UGF) ever goes down, the platform gracefully degrades. Users can click the "Bypass UGF" icon to switch to standard Web3 transactions, ensuring the application remains 100% operational even during relayer downtime.

---

## 🔮 V2 Architecture Roadmap

While V1 perfectly executes the core gasless donation loop, we have extensively architected a **V2 Roadmap** (`V2_ARCHITECTURE.md`) to solve massive Web3 economic problems. 

V2 introduces **Economic Staking & Slashing** to prevent rich trolls from spamming the "Flag Suspicious" button, dynamic **NGO Branding Profiles**, and **Strict Admin UI Role Gating**.
