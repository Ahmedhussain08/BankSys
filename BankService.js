const Account = require("./Account");
const storage = require("./storage");

const {
    quickSortById,
    quickSortByBalance
} = require("./quickSort");

class BankService {

    constructor() {
        // Array (Vector) representation of data
        this.accounts = storage.loadAccounts();

        // O(1) HashMap lookup implementation
        this.accountMap = new Map();

        this.accounts.forEach(account => {
            this.accountMap.set(account.id, account);
        });

        // Transaction History
        this.transactions = storage.loadTransactions();
    }

    // ==========================================
    // Create Account
    // ==========================================
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

    // ==========================================
    // Get All Accounts
    // ==========================================
    getAccounts() {
        return this.accounts;
    }

    // ==========================================
    // Search Account: O(1) using HashMap
    // ==========================================
    searchAccount(id) {
        return this.accountMap.get(id) || null;
    }

    // ==========================================
    // Deposit
    // ==========================================
    deposit(id, amount) {
        const depositAmount = Number(amount);

        // BUG FIX: Block negative values or zero inputs
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

    // ==========================================
    // Withdraw
    // ==========================================
    withdraw(id, amount) {
        const withdrawAmount = Number(amount);

        // BUG FIX: Block negative values or zero inputs
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

    // ==========================================
    // Transfer
    // ==========================================
    transfer(fromId, toId, amount) {
        // BUG FIX: Prevent self-transfers
        if (fromId === toId) {
            return {
                success: false,
                message: "Cannot transfer funds to the same account."
            };
        }

        const transferAmount = Number(amount);

        // BUG FIX: Block negative values or zero inputs
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
                message: "Invalid account routing paths."
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

    // ==========================================
    // Delete Account
    // ==========================================
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

    // ==========================================
    // Sort by Account ID (Quick Sort)
    // ==========================================
    sortById() {
        const sortedAccounts = [...this.accounts];
        return quickSortById(sortedAccounts);
    }

    // ==========================================
    // Sort by Balance (Quick Sort)
    // ==========================================
    sortByBalance() {
        const sortedAccounts = [...this.accounts];
        return quickSortByBalance(sortedAccounts);
    }

    // ==========================================
    // Populate Dummy Data (Demo Tools)
    // ==========================================
    populateDummyData() {
        // Only run if the database array is currently empty
        if (this.accounts.length > 0) {
            return {
                success: false,
                message: "System already contains data. Clear records to load template."
            };
        }

        const dummyAccounts = [
            { id: "1001", name: "Alice Smith", type: "Savings", balance: 25000 },
            { id: "1002", name: "Bob Jones", type: "Current", balance: 5000 },
            { id: "1003", name: "Charlie Brown", type: "Savings", balance: 125000 },
            { id: "1004", name: "Diana Prince", type: "Current", balance: 8700 }
        ];

        dummyAccounts.forEach(data => {
            const account = new Account(data.id, data.name, data.type, data.balance);
            this.accounts.push(account);
            this.accountMap.set(data.id, account);
        });

        storage.saveAccounts(this.accounts);

        return {
            success: true,
            message: "Successfully loaded 4 dummy accounts into database structures."
        };
    }

    // ==========================================
    // Add Transaction
    // ==========================================
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

    // ==========================================
    // Get Transaction History
    // ==========================================
    getTransactions() {
        return this.transactions;
    }
}

module.exports = BankService;
