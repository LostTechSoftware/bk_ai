const SendPartnerSales = require("./SendPartnerSales");

const SendSlackNotification = async (message, channel) => {
  const obj = {
    SendPartnerSales: SendPartnerSales(message),
  };

  return obj[channel] || null;
};

module.exports = { SendSlackNotification };
