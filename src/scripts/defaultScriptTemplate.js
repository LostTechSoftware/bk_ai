const fs = require("fs");
const moment = require("moment");
const logger = require("js-logger");

/**
 * This template have some basic structure that will be useful to most scripts, copy and use it
 */
module.exports = async () => {
  // await scripts.defaultScriptTemplate()
  // Log your results
  const result = [];
  // Log your errors
  const errors = [];

  // do some awesome stuff

  logger.info(`[Successful executions] ${result.length}`);
  logger.info(`[Failed executions] ${errors.length}`);

  // change the name of your script
  const scriptLogIdentifier = `batata_script`;

  const uniqueIdentifier = moment().format();
  const fsOptions = { encoding: "utf8", flag: "w" };

  const filePathResult = `src/scripts/logs/${uniqueIdentifier}_${scriptLogIdentifier}_result.txt`;
  const filePathError = `src/scripts/logs/${uniqueIdentifier}_${scriptLogIdentifier}_error.txt`;

  // @ts-ignore
  fs.writeFileSync(
    filePathResult,
    JSON.stringify(result, undefined, 2),
    fsOptions
  );
  // @ts-ignore
  fs.writeFileSync(
    filePathError,
    JSON.stringify(errors, undefined, 2),
    fsOptions
  );
};
