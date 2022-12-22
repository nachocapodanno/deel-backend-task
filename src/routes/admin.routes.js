const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin.controller");

router.get("/best-profession", adminController.bestProfessionByDateRange);
router.get("/best-clients", adminController.bestClientByDateRange);

module.exports = router;
