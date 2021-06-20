const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;

console.log(
  `Banco de dados conectado: ${
    process.env.PROD === true ? "Produção" : "Staging"
  }`
);

module.exports = mongoose;
