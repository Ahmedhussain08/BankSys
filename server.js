const express = require("express");
const path = require("path");
const BankService = require("./BankService");

const app = express();
const bank = new BankService();

// Railway uses its own port
const PORT = process.env.PORT || 3000;

/* ======================================
   Middleware
====================================== */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ======================================
   GET ALL ACCOUNTS
====================================== */
app.get("/accounts", (req, res) => {
    res.json(bank.getAccounts());
});

/* ======================================
   CREATE ACCOUNT
====================================== */
app.post("/accounts", (req, res) => {

    const { id, name, accountType, balance } = req.body;

    const result = bank.createAccount(
        Number(id),
        name,
        accountType,
        Number(balance)
    );

    res.json(result);

});

/* ======================================
   SEARCH ACCOUNT
====================================== */
app.get("/accounts/:id", (req, res) => {

    const account = bank.searchAccount(Number(req.params.id));

    if (account) {
        res.json(account);
    } else {
        res.status(404).json({
            success: false,
            message: "Account not found."
        });
    }

});

/* ======================================
   DEPOSIT
====================================== */
app.put("/deposit", (req, res) => {

    const { id, amount } = req.body;

    const result = bank.deposit(
        Number(id),
        Number(amount)
    );

    res.json(result);

});

/* ======================================
   WITHDRAW
====================================== */
app.put("/withdraw", (req, res) => {

    const { id, amount } = req.body;

    const result = bank.withdraw(
        Number(id),
        Number(amount)
    );

    res.json(result);

});

/* ======================================
   TRANSFER
====================================== */
app.put("/transfer", (req, res) => {

    const { fromId, toId, amount } = req.body;

    const result = bank.transfer(
        Number(fromId),
        Number(toId),
        Number(amount)
    );

    res.json(result);

});

/* ======================================
   DELETE ACCOUNT
====================================== */
app.delete("/accounts/:id", (req, res) => {

    const result = bank.deleteAccount(
        Number(req.params.id)
    );

    res.json(result);

});

/* ======================================
   SORT BY ACCOUNT ID
====================================== */
app.get("/sort/id", (req, res) => {

    res.json(bank.sortById());

});

/* ======================================
   SORT BY BALANCE
====================================== */
app.get("/sort/balance", (req, res) => {

    res.json(bank.sortByBalance());

});

/* ======================================
   TRANSACTION HISTORY
====================================== */
app.get("/transactions", (req, res) => {

    res.json(bank.getTransactions());

});

/* ======================================
   HOME PAGE
====================================== */
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

/* ======================================
   404 Handler
====================================== */
app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found."
    });

});

/* ======================================
   Start Server
====================================== */
app.listen(PORT, () => {

    console.log("==================================");
    console.log(" Banking Management System");
    console.log("==================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);

});