const { sendLogInfo, sendLogError } = require("../../logs/coralogix");
const User = require("../../models/user");

const NewUser = async (req, res) => {
  try {
    const { UserId } = req.body;
    sendLogInfo({
      data: `Criando novo usuário ${UserId}`,
      name: "INFO",
    });

    const user = await User.create({ UserId });

    res.send(user);
  } catch (error) {
    req.sentry.captureException(error);
    sendLogError({ data: error, name: "ERROR IN CREATE USER" });
    res.status(400).send("ERROR IN CREATE USER");
  }
};

module.exports = NewUser;
