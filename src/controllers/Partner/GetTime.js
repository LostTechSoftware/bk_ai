const { sendLogInfo, sendLogError } = require("../../logs/coralogix");
const Partner = require("../../models/restaurant");

const GetTime = async (req, res) => {
  try {
    const { name, PartnerId } = req.body;
    sendLogInfo({
      data: `Buscando tempo de delivery do partner ${name}`,
      name: "INFO",
    });

    const partner = await Partner.findOne({ PartnerId });

    res.status(200).send({ errr: false, data: partner.TimeOfDelivery });
  } catch (error) {
    req.sentry.captureException(error);
    sendLogError({ data: error, name: "ERROR IN GET PARTNER TIME" });
    res.status(400).send("ERROR IN GET PARTNER TIME");
  }
};

module.exports = GetTime;
