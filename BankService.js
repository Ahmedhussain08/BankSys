const Account = require("./Account");
const storage = require("./storage");

const {
    quickSortById,
    quickSortByBalance
} = require("./quickSort");

class BankService {

    constructor() {
        // Array (Vector)
        this.accounts = storage.loadAccounts();

        // HashMap
        this.accountMap = new Map();

        this.accounts.forEach(account => {
            this.accountMap.set(account.id, account);
        });

        // Transaction History
        this.transactions = storage.loadTransactions();
    }

    // =========================
    // Create Account
    // =========================
    createAccount(id, name, accountType, balance) {
        if (this.accountMap.has(id)) {
            return {
                success: false,
                message: "Account ID already exists."
            };
        }

        const initialBalance = Number(balance);
        if (isNaN(initialBalance) || initialBalance < 0) {
            return {
                success: false,
                message: "Initial balance cannot be negative."
            };
        }

        const account = new Account(
            id,
            name,
            accountType,
            initialBalance
        );

        this.accounts.push(account);
        this.accountMap.set(id, account);

        storage.saveAccounts(this.accounts);

        return {
            success: true,
            message: "Account created successfully."
        };
    }

    // =========================
    // Get All Accounts
    // =========================
    getAccounts() {
        return this.accounts;
    }

    // =========================
    // Search Account
    // O(1) using HashMap
    // =========================
    searchAccount(id) {
        return this.accountMap.get(id) || null;
    }

    // =========================
    // Deposit
    // =========================
    deposit(id, amount) {
        const depositAmount = Number(amount);

        // BUG FIX: Block negative values or zero
        if (isNaN(depositAmount) || depositAmount <= 0) {
            return {
                success: false,
                message: "Deposit amount must be greater than zero."
            };
        }

        const account = this.accountMap.get(id);

        if (!account) {
            return {
                success: false,
                message: "Account not found."
            };
        }

        account.balance += depositAmount;

        storage.saveAccounts(this.accounts);

        this.addTransaction(
            "Deposit",
            id,
            null,
            depositAmount
        );

        return {
            success: true,
            message: "Deposit successful."
        };
    }

    // =========================
    // Withdraw
    // =========================
    withdraw(id, amount) {
        const withdrawAmount = Number(amount);

        // BUG FIX: Block negative values or zero
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            return {
                success: false,
                message: "Withdrawal amount must be greater than zero."
            };
        }

        const account = this.accountMap.get(id);

        if (!account) {
            return {
                success: false,
                message: "Account not found."
            };
        }

        if (account.balance < withdrawAmount) {
            return {
                success: false,
                message: "Insufficient balance."
            };
        }

        account.balance -= withdrawAmount;

        storage.saveAccounts(this.accounts);

        this.addTransaction(
            "Withdraw",
            id,
            null,
            withdrawAmount
        );

        return {
            success: true,
            message: "Withdrawal successful."
        };
    }

    // =========================
    // Transfer
    // =========================
    transfer(fromId, toId, amount) {
        // BUG FIX: Block self-transfers
        if (fromId === toId) {
            return {
                success: false,
                message: "Cannot transfer funds to the same account."
            };
        }

        const transferAmount = Number(amount);

        // BUG FIX: Block negative values or zero
        if (isNaN(transferAmount) || transferAmount <= 0) {
            return {
                success: false,
                message: "Transfer amount must be greater than zero."
            };
        }

        const sender = this.accountMap.get(fromId);
        const receiver = this.accountMap.get(toId);

        if (!sender || !receiver) {
            return {
                success: false,
                message: "Invalid account."
            };
        }

        if (sender.balance < transferAmount) {
            return {
                success: false,
                message: "Insufficient balance."
            };
        }

        sender.balance -= transferAmount;
        receiver.balance += transferAmount;

        storage.saveAccounts(this.accounts);

        this.addTransaction(
            "Transfer",
            fromId,
            toId,
            transferAmount
        );

        return {
            success: true,
            message: "Transfer successful."
        };
    }

    // =========================
    // Delete Account
    // =========================
    deleteAccount(id) {
        if (!this.accountMap.has(id)) {
            return {
                success: false,
                message: "Account not found."
            };
        }

        this.accounts = this.accounts.filter(
            account => account.id !== id
        );

        this.accountMap.delete(id);

        storage.saveAccounts(this.accounts);

        return {
            success: true,
            message: "Account deleted."
        };
    }

    // =========================
    // Sort by Account ID
    // Quick Sort
    // =========================
    sortById() {
        const sortedAccounts = [...this.accounts];
        return quickSortById(sortedAccounts);
    }

    // =========================
    // Sort by Balance
    // Quick Sort
    // =========================
    sortByBalance() {
        const sortedAccounts = [...this.accounts];
        return quickSortByBalance(sortedAccounts);
    }

    // =========================
    // Add Transaction
    // =========================
    addTransaction(type, from, to, amount) {
        this.transactions.push({
            type,
            from,
            to,
            amount,
            date: new Date().toLocaleString()
        });

        storage.saveTransactions(this.transactions);
    }

    // =========================
    // Get Transaction History
    // =========================
    getTransactions() {
        return this.transactions;
    }

}

module.exports = BankService;
