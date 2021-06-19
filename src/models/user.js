const mongoose = require("../database");

const UserSchema = new mongoose.Schema({
  UserId: String,
  Categories: [],
  CategoriesDrink: [],
  Sugestion: String,
  SugestionDrink: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
