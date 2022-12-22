const { Op } = require("sequelize");

exports.contractsList = async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.profile

  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: id }, { ClientId: id }],
      [Op.and]: [{ status: { [Op.ne]: "terminated" } }],
    },
  });
  res.json(contracts);
};

exports.getContractById = async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  const { id: profileId } = req.profile

  const contract = await Contract.findOne({
    where: {
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      [Op.and]: [{ id }],
    },
  });
  if (!contract) return res.status(404).end();
  return res.json(contract);
};

