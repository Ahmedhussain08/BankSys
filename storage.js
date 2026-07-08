const fs = require("fs");
const path = require("path");

const ACCOUNT_FILE = path.join(__dirname, "data", "accounts.json");
const TRANSACTION_FILE = path.join(__dirname, "data", "transactions.json");
// ---------- Accounts ----------

function loadAccounts() {
    if (!fs.existsSync(ACCOUNT_FILE)) {
        return [];
    }

    const data = fs.readFileSync(ACCOUNT_FILE, "utf8");

    if (data.trim() === "") {
        return [];
    }

    return JSON.parse(data);
}

function saveAccounts(accounts) {
    fs.writeFileSync(
        ACCOUNT_FILE,
        JSON.stringify(accounts, null, 4)
    );
}

// ---------- Transactions ----------

function loadTransactions() {
    if (!fs.existsSync(TRANSACTION_FILE)) {
        return [];
    }

    const data = fs.readFileSync(TRANSACTION_FILE, "utf8");

    if (data.trim() === "") {
        return [];
    }

    return JSON.parse(data);
}

function saveTransactions(transactions) {
    fs.writeFileSync(
        TRANSACTION_FILE,
        JSON.stringify(transactions, null, 4)
    );
}

module.exports = {
    loadAccounts,
    saveAccounts,
    loadTransactions,
    saveTransactions
};