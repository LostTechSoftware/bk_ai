const Sentry = require("@sentry/node");
const {
  Severity,
  LoggerConfig,
  CoralogixLogger,
  Log,
} = require("coralogix-logger");
const getRequestId = require("../getRequestId");

CoralogixLogger.configure(
  new LoggerConfig({
    applicationName: "bk-ai",
    privateKey: "86807c6a-fd78-6edd-b6e3-9984194170c2",
    subsystemName: process.env.NODE_ENV,
  })
);

const logger = new CoralogixLogger("Logger");

module.exports = {
  // Send warning log to Coralogix
  warn: (data) => {
    const text = { data, request_id: getRequestId() };

    console.log(text);

    logger.addLog(
      new Log({
        severity: Severity.warning,
        className: "ConsoleLogger",
        methodName: "logger",
        text,
      })
    );
  },

  // Send error log to Coralogix
  error: (data) => {
    const text = { data, request_id: getRequestId() };

    console.log(text);

    logger.addLog(
      new Log({
        severity: Severity.error,
        className: "ConsoleLogger",
        methodName: "logger",
        text,
      })
    );

    Sentry.setTag("request_id", getRequestId());
    Sentry.captureException(data);
  },

  // Send information log to Coralogix
  info: (data) => {
    const text = { data, request_id: getRequestId() };

    console.log(text);

    logger.addLog(
      new Log({
        severity: Severity.info,
        className: "ConsoleLogger",
        methodName: "logger",
        text,
      })
    );
  },

  // Transform object in string with json stringify
  beautify: (data) => JSON.stringify(data, undefined, 2),
};
