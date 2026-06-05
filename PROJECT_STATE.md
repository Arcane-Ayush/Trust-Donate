# PROJECT_STATE.md

## Contract
- Address: 0x0000000000000000000000000000000000000000 (TBD after deploy)
- Network: Base Sepolia
- Admin wallet: 0x0000000000000000000000000000000000000000 (TBD)

## ABI
- Location: shared/contractABI.json
- Last updated: Generated and available

## Function status
- donate()         ✅ mapped in blockchain.js
- recordExpense()  ✅ mapped in blockchain.js
- flagExpense()    ✅ mapped in blockchain.js
- getDonations()   ✅ mapped in blockchain.js
- getExpenses()    ✅ mapped in blockchain.js
- getTotals()      ✅ mapped in blockchain.js

## Pages
- [x] Landing             (Person 2) - Updated with official pitch and navigation
- [x] Donate              (Person 2) - Added UGF balance display
- [x] UserDashboard       (Person 2) - Added community fund note and wallet identity
- [ ] NGODashboard        (Person 4)
- [ ] PublicDashboard     (Person 4)

## UGF integration
- [x] Mock UGF balance displayed
- [ ] SDK installed
- [ ] donate() wired through UGF
- [ ] recordExpense() wired through UGF

## Known issues / blockers
- Blocked on real contract deployment until deployer wallet is funded on Base Sepolia. Mock values will be used for now to unblock Person 2 and Person 4.
- Contract not yet deployed. Person 3 needed.

## Last updated by
- Person 2 at 2026-06-05
- Person 3 at initial setup
