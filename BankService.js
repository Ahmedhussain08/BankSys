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

        const account = new Account(
            id,
            name,
            accountType,
            balance
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

        const account = this.accountMap.get(id);

        if (!account) {
            return {
                success: false,
                message: "Account not found."
            };
        }

        account.balance += amount;

        storage.saveAccounts(this.accounts);

        this.addTransaction(
            "Deposit",
            id,
            null,
            amount
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

        const account = this.accountMap.get(id);

        if (!account) {
            return {
                success: false,
                message: "Account not found."
            };
        }

        if (account.balance < amount) {
            return {
                success: false,
                message: "Insufficient balance."
            };
        }

        account.balance -= amount;

        storage.saveAccounts(this.accounts);

        this.addTransaction(
            "Withdraw",
            id,
            null,
            amount
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

        const sender = this.accountMap.get(fromId);
        const receiver = this.accountMap.get(toId);

        if (!sender || !receiver) {
            return {
                success: false,
                message: "Invalid account."
            };
        }

        if (sender.balance < amount) {
            return {
                success: false,
                message: "Insufficient balance."
            };
        }

        sender.balance -= amount;
        receiver.balance += amount;

        storage.saveAccounts(this.accounts);

        this.addTransaction(
            "Transfer",
            fromId,
            toId,
            amount
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