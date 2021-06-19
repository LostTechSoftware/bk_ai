const { sendLogInfo, sendLogError } = require("../../logs/coralogix");
const Partner = require("../../models/restaurant");

const NewPartner = async (req, res) => {
  try {
    const { name, PartnerId, TimeOfDelivery } = req.body;
    sendLogInfo({
      data: `Criando novo parceiro ${name}`,
      name: "INFO",
    });

    const partner = await Partner.create({ name, PartnerId, TimeOfDelivery });

    res.send(partner);
  } catch (error) {
    req.sentry.captureException(error);
    sendLogError({ data: error, name: "ERROR IN CREATE PARTNER" });
    res.status(400).send("ERROR IN CREATE PARTNER");
  }
};

module.exports = NewPartner;
