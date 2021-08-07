const { sendLogInfo, sendLogError } = require("../../logs/coralogix");
const User = require("../../models/user");

const GetSugestion = async (req, res) => {
  try {
    const { UserId } = req.body;
    sendLogInfo({
      data: `Buscando sugestões para o user ${UserId}`,
      name: "INFO",
    });

    const user =
      (await User.findOne({ UserId })) || (await User.create({ UserId }));

    res
      .status(200)
      .send({ errr: false, food: user.Sugestion, drink: user.SugestionDrink });
  } catch (error) {
    req.sentry.captureException(error);
    sendLogError({ data: error, name: "ERROR IN GET SUGESTION TIME" });
    res.status(400).send("ERROR IN GET SUGESTION TIME");
  }
};

module.exports = GetSugestion;
