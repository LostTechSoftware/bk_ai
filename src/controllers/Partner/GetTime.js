const logs = require("../../logs");
const Partner = require("../../models/restaurant");

const GetTime = async (req, res) => {
  try {
    const { name, PartnerId } = req.body;
    logs.info(`Buscando tempo de delivery do partner ${name}`);

    const partner = await Partner.findOne({ PartnerId });

    res.status(200).send({ errr: false, data: partner.TimeOfDelivery });
  } catch (error) {
    logs.error(error);
    res.status(400).send("ERROR IN GET PARTNER TIME");
  }
};

module.exports = GetTime;
