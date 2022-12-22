const { Op } = require("sequelize");
const { sequelize } = require("../models");

exports.depositMoney = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const { Job, Contract, Profile } = req.app.get("models");
      const {amount} = req.body;
      const { userId } = req.params;
      const originClient = req.profile;

      const { type, balance: originClientBalance, id: originClientId } = originClient;

      if (type !== "client")
        return res.status(400).json({ error: "Profile is not a client" }).end();

      const clientToDeposit = await Profile.findOne({
        where: {
          [Op.and]: [{ id: userId }, { type: "client" }],
        },
      });

      if (!clientToDeposit)
        return res
          .status(400)
          .json({ error: "User id is not a valid client" })
          .end();

      const totalJobsToPay = await Job.sum("price", {
        include: {
          model: Contract,
          where: {
            ClientId: originClientId,
          },
        },
        where: {
          paid: { [Op.not]: true },
        },
      });

      const quarterJobsToPay = ((totalJobsToPay * 25) / 100).toFixed(2)

      if (amount > quarterJobsToPay || amount < 0 || originClientBalance < amount) {
        return res.status(400).json({ error: "Invalid client amount" }).end();
      }

      try {
        const { balance: clientToDepositBalance } = clientToDeposit;

        await clientToDeposit.update(
          { balance: clientToDepositBalance + amount },
          { transaction: t }
        );

        await originClient.update(
          { balance: originClientBalance - amount },
          { transaction: t }
        );
      } catch (error) {
        throw new Error("Error paying for a job");
      }

      return res.json({ message: "Deposit done" }).end();
    });
    return result;
  } catch (error) {
    throw new Error("Error on deposit balance");
  }
};
