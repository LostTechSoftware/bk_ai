const mongoose = require("../database");

const RouteSchema = new mongoose.Schema({
  DeliveryManId: String,
  initialPoint: Array,
  distances: Array,
});

const Route = mongoose.model("Route", RouteSchema);

module.exports = Route;
