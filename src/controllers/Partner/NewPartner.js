const logs = require("../../logs");
const Partner = require("../../models/restaurant");

const NewPartner = async (req, res) => {
  try {
    const { name, PartnerId, TimeOfDelivery } = req.body;
    logs.info(`Criando novo parceiro ${name}`);

    const partner = await Partner.create({ name, PartnerId, TimeOfDelivery });

    res.send(partner);
  } catch (error) {
    logs.error(error);
    res.status(400).send("ERROR IN CREATE PARTNER");
  }
};

module.exports = NewPartner;
