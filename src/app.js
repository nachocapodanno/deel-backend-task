const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const { getProfile } = require("./middleware/getProfile");

const contractsRouter = require("./routes/contracts.routes");
const jobsRouter = require("./routes/jobs.routes");
const balancesRouter = require("./routes/balances.routes");
const adminRouter = require("./routes/admin.routes");

const app = express();
app.use(bodyParser.json());
app.set("models", sequelize.models);
app.set("sequelize", sequelize);

app.use("/contracts", getProfile, contractsRouter);
app.use("/jobs", getProfile, jobsRouter);
app.use("/balances", getProfile, balancesRouter);
app.use("/admin", adminRouter);

module.exports = app;
