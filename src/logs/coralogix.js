const Coralogix = require("coralogix-logger");

// global confing for application name, private key, subsystem name
const config = new Coralogix.LoggerConfig({
  applicationName: "MS_AI",
  privateKey: "35a4e0a3-6526-9a50-d1d2-1f1b9d14bd25",
  subsystemName:
    process.env.NODE_ENV === "production" ? "PRODUCTION" : "STAGING",
});

Coralogix.CoralogixLogger.configure(config);

// create a new logger with category
const info = new Coralogix.CoralogixLogger("info");
const error = new Coralogix.CoralogixLogger("error");

function sendLogInfo({ name, data }) {
  console.log({ name, data });

  const log = new Coralogix.Log({
    severity: Coralogix.Severity.info,
    className: name,
    methodName: name,
    text: data,
  });

  info.addLog(log);
}

function sendLogError({ name, data }) {
  console.log({ name, data });

  const log = new Coralogix.Log({
    severity: Coralogix.Severity.error,
    className: name,
    methodName: name,
    text: data,
  });

  error.addLog(log);
}

module.exports = { sendLogInfo, sendLogError };
