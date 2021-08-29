const httpContext = require("express-http-context");
const { v4: uuidv4 } = require("uuid");

const logs = require("../logs");

const middlewaresLogs = async (app) => {
  app.all("*", (req, res, next) => {
    const requestId = req.headers.request_id || uuidv4();

    req.requestId = requestId;

    httpContext.set("requestId", requestId);

    logs.info(`[${req.method}] ${req.path}`);
    logs.info(logs.beautify(req.body));

    return next();
  });
};

module.exports = middlewaresLogs;
