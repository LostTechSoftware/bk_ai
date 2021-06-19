const moment = require("moment");
const { sendLogInfo } = require("../logs/coralogix");

module.exports = (req, res, next) => {
  const { body } = req;
  const data = `[INFO ${moment().format("MMM Do YY")}] ${{ ...body }}`;

  sendLogInfo({ data, name: "INFO" });

  return next();
};
