const express = require("express");

const router = express.Router();

const balanceController = require("../controllers/balance.controller");

router.post("/deposit/:userId", balanceController.depositMoney);

module.exports = router;
