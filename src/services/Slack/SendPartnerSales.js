const axios = require("axios");
const { sendLogInfo, sendLogError } = require("../../logs/coralogix");

const SendPartnerSales = async (message) => {
  try {
    await axios.post(
      "https://hooks.slack.com/services/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",
      {
        text: message,
      }
    );

    sendLogInfo("Message have sendend to slack");
  } catch (error) {
    sendLogError(error);
  }
};

module.exports = SendPartnerSales;
