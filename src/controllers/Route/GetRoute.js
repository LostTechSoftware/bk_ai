const logs = require("../../logs");
const Route = require("../../models/route");

const GetRoute = async (req, res) => {
  try {
    const { DeliveryManId } = req.body;
    logs.info(`Buscando as rotas para o entregador ${DeliveryManId}`);

    const route = await Route.findOne({ DeliveryManId });

    res.status(200).send({ errr: false, data: route });
  } catch (error) {
    logs.error(error);
    res.status(400).send("ERROR IN GET ROUTE");
  }
};

module.exports = GetRoute;
