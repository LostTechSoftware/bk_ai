const { default: axios } = require("axios");
const { sendLogInfo, sendLogError } = require("../../logs/coralogix");
const Route = require("../../models/route");

const NewRoute = async (req, res) => {
  try {
    const { points, initialPoint, DeliveryManId } = req.body;
    sendLogInfo({
      data: `Calculando nova rota`,
      name: "INFO",
    });

    const distances = [];

    for (const point of points) {
      const distance = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${initialPoint[0]},${initialPoint[1]}&destinations=${point[0]},${point[1]}&key=${process.env.GOOGLE_KEY}`
      );

      if (distance.data.status === "OK") {
        if (distance.data.rows.length) {
          const distanceformated =
            distance.data.rows[0].elements[0].distance.value;

          distances.push({ point, distance: distanceformated });

          distances.sort((a, b) => a.distance - b.distance);
        }
      }
    }

    await Route.create({
      DeliveryManId,
      initialPoint,
      distances,
    });

    sendLogInfo({
      data: `Nova rota calculada`,
      name: "INFO",
    });
    res.status(200).json("NOVA ROTA CRIADA");
  } catch (error) {
    req.sentry.captureException(error);
    console.log(error);
    sendLogError({
      data: error,
      name: "ERROR IN CREATE NEW ROUTE",
    });
    res.status(400).send("ERROR IN CREATE NEW ROUTE");
  }
};

module.exports = NewRoute;
