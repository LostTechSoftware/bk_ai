const logs = require("../../logs");
const User = require("../../models/user");

const NewUser = async (req, res) => {
  try {
    const { UserId } = req.body;
    logs.info(`Criando novo usuário ${UserId}`);

    const user = await User.create({ UserId });

    res.send(user);
  } catch (error) {
    logs.error(error);
    res.status(400).send("ERROR IN CREATE USER");
  }
};

module.exports = NewUser;
