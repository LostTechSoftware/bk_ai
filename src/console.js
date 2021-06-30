const repl = require("repl");
require("dotenv").config();

const start = async () => {
  const mongoose = require("mongoose");

  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  mongoose.Promise = global.Promise;
  console.log("MongoDB connected");

  const replServer = repl.start({
    prompt: "Server Console > ",
  });

  replServer.context.mongoose = mongoose;

  replServer.context.scripts = require("./scripts");
};

start();
