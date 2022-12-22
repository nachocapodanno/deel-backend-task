const { Op } = require("sequelize");
const { sequelize } = require("../models");

exports.bestProfessionByDateRange = async (req, res) => {
  const { Job, Contract, Profile } = req.app.get("models");
  const { start, end } = req.query;

  const jobs = await Job.findAll({
    attributes: [
      "Contract.Contractor.profession",
      [sequelize.fn("SUM", sequelize.col("price")), "totalAmount"],
    ],
    include: {
      model: Contract,
      as: "Contract",
      include: {
        model: Profile,
        as: "Contractor",
      },
    },
    where: {
      [Op.and]: [
        { paid: { [Op.ne]: false } },
        {
          createdAt: {
            [Op.gt]: new Date(start),
            [Op.lt]: new Date(end),
          },
        },
      ],
    },
    group: "Contract.Contractor.profession",
    order: [["totalAmount", "DESC"]],
  });
  res.json(jobs.length > 0 ? jobs[0].Contract.Contractor.profession : []);
};

exports.bestClientByDateRange = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get("models");
  const { start, end, limit } = req.query;

  const clients = await Job.findAll({
    attributes: ["id", [sequelize.fn("SUM", sequelize.col("price")), "paid"]],
    include: {
      model: Contract,
      as: "Contract",
      include: {
        model: Profile,
        as: "Client",
      },
    },
    where: {
      [Op.and]: [
        { paid: { [Op.ne]: false } },
        {
          createdAt: {
            [Op.gt]: new Date(start),
            [Op.lt]: new Date(end),
          },
        },
      ],
    },
    group: "Contract.Client.id",
    order: [["paid", "DESC"]],
    limit: limit ?? 2,
  });

  const resp = clients.map(
    ({
      id,
      paid,
      Contract: {
        Client: { firstName, lastName },
      },
    }) => ({
      id,
      fullName: `${firstName} ${lastName}`,
      paid,
    })
  );
  res.json(resp).end();
};
