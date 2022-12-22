const express = require("express");

const router = express.Router();

const jobsController = require("../controllers/job.controller");

router.get("/unpaid", jobsController.getUnpaidJobs);
router.post("/:id/pay", jobsController.payForAJob);

module.exports = router;
