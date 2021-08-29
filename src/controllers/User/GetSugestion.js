const logs = require("../../logs");
const User = require("../../models/user");

const GetSugestion = async (req, res) => {
  try {
    const { UserId } = req.body;
    logs.info(`Buscando sugestões para o user ${UserId}`);

    const user =
      (await User.findOne({ UserId })) || (await User.create({ UserId }));

    res
      .status(200)
      .send({ errr: false, food: user.Sugestion, drink: user.SugestionDrink });
  } catch (error) {
    logs.error(error);
    res.status(400).send("ERROR IN GET SUGESTION TIME");
  }
};

module.exports = GetSugestion;
