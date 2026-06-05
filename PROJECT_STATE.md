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
- [ ] Landing             (Person 2)
- [ ] Donate              (Person 2)
- [ ] UserDashboard       (Person 2)
- [x] NGODashboard        (Person 4)
- [x] PublicDashboard     (Person 4)

## UGF integration
- [ ] SDK installed
- [ ] donate() wired through UGF
- [ ] recordExpense() wired through UGF

## Known issues / blockers
- Blocked on real contract deployment until deployer wallet is funded on Base Sepolia. Mock values will be used for now to unblock Person 2 and Person 4.

## Last updated by
- Person 4 at current time
