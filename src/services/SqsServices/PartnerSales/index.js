const { SendSlackNotification } = require("../../Slack");

async function PartnerSales(restaurants) {
  restaurants.map((restaurant) => {
    SendSlackNotification(
      `O estabelecimento ${restaurant.name}, da cidade ${restaurant.city} vendeu apenas ${restaurant.sales} nos últimos sete dias`,
      "SendPartnerSales"
    );
  });
}

module.exports = PartnerSales;
