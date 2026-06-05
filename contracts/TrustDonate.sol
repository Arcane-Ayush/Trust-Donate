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
