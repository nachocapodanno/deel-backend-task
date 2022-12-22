const { Op } = require("sequelize");
const { sequelize } = require("../models");

exports.getUnpaidJobs = async (req, res) => {
  const { Job, Contract } = req.app.get("models");
  const { id: profileId } = req.profile;

  const jobs = await Job.findAll({
    include: {
      model: Contract,
      where: {
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        [Op.and]: [{ status: { [Op.eq]: "in_progress" } }],
      },
    },
    where: {
      paid: { [Op.not]: true },
    },
  });
  res.json(jobs);
};

exports.payForAJob = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const { Job, Contract } = req.app.get("models");
      const { id } = req.params;
      const { id: profileId } = req.profile;

      const jobToPay = await Job.findOne({
        include: {
          model: Contract,
          where: {
            ClientId: profileId,
          },
        },
        where: {
          [Op.and]: [{ id }, { paid: { [Op.not]: true } }],
        },
      });

      if (!jobToPay)
        return res.status(404).json({ error: "Not validate job to pay" }).end();

      const { Contract: contract, price } = jobToPay;

      if (!contract) return res.status(404).end();

      const client = req.profile;
      const { balance: clientBalance } = client;

      if (clientBalance < price)
        return res
          .status(404)
          .json({ error: "Not enough client balance" })
          .end();

      const contractor = await contract.getContractor();
      await contractor.update(
        { balance: contractor.balance + price },
        { transaction: t }
      );

      await client.update(
        { balance: clientBalance - price },
        { transaction: t }
      );

      await jobToPay.update(
        { paid: 1, paymentDate: new Date() },
        { transaction: t }
      );
      return res.json({ message: "Payment done" });
    });
    return result;
  } catch (error) {
    throw new Error("Error paying for a job");
  }
};
