require("dotenv/config");
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const rateLimit = require("express-rate-limit");
const Sentry = require("@sentry/node");
const helmet = require("helmet");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

const server = http.Server(app);

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 500,
  keyGenerator: (req) => {
    return req.ip;
  },
  handler: (_, res) => {
    res.status(429).send("Limit of requests is hit-in");
  },
});

app.use(rateLimiter);
app.use((req, res, next) => {
  res.set("X-Powered-By", "PHP/7.1.7");
  next();
});
app.use(helmet());

Sentry.init({
  dsn: process.env.SENTRY_URL,
  environment: process.env.PROD === true ? "PRODUCTION" : "STAGING",
});

app.use((req, res, next) => {
  req.sentry = Sentry;

  return next();
});

app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.errorHandler());

require("./routes")(app);
require("./logs/coralogix");

console.log(process.env.PORT || 3002);

server.listen(process.env.PORT || 3002);
