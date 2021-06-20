const moment = require("moment");
const { sendLogInfo } = require("../logs/coralogix");

module.exports = (req, res, next) => {
  const { body } = req;
  const data1 = `[INFO ${moment().format("MMM Do YY")}]`;
  const data2 = body;

  sendLogInfo({ data: data1, name: "INFO" });
  sendLogInfo({ data: data2, name: "INFO" });

  return next();
};
