const { sendLogInfo, sendLogError } = require("../../logs/coralogix");
const Route = require("../../models/route");

const GetRoute = async (req, res) => {
  try {
    const { DeliveryManId } = req.body;
    sendLogInfo({
      data: `Buscando as rotas para o entregador ${DeliveryManId}`,
      name: "INFO",
    });

    const route = await Route.findOne({ DeliveryManId });

    res.status(200).send({ errr: false, data: route });
  } catch (error) {
    req.sentry.captureException(error);
    sendLogError({ data: error, name: "ERROR IN GET ROUTE" });
    res.status(400).send("ERROR IN GET ROUTE");
  }
};

module.exports = GetRoute;
