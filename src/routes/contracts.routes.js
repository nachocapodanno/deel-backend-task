const express = require("express");

const router = express.Router();

const contractController = require("../controllers/contract.controller");

router.get("/", contractController.contractsList);
router.get("/:id", contractController.getContractById);

module.exports = router;
