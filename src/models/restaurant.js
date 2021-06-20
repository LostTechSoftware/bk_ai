const mongoose = require("../database");

const RestaurantSchema = new mongoose.Schema({
  name: String,
  TimesOfDelivery: [],
  TimeOfDelivery: Number,
  PartnerId: String,
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;
