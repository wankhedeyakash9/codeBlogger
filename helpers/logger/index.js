const winston = require("winston");
// Get logger from external configuration source
const winstonConfig = require("../../config/winston-config");

let defaultLogger = winstonConfig.defaultLogger;

module.exports = {
  info: (req, res, next) => {
    const MODULE = `controllers/${req.originalUrl.split("/")[0]}`;
    // Add another logger with the category specific to this module
    winston.loggers.add(MODULE, winstonConfig.createLoggerConfig(MODULE));

    const moduleLogger = winston.loggers.get(MODULE);
    //logging
    defaultLogger.info(`In ${MODULE}`);
    moduleLogger.info(req.originalUrl);
    moduleLogger.debug(req.originalUrl, {
      params: req.body,
      method: req.method,
      ip: req.ip,
    });
    next();
  },

  error: (error, req, res, next) => {
    const MODULE = `controllers/${req.originalUrl.split("/")[0]}`;
    // Add another logger with the category specific to this module
    winston.loggers.add(MODULE, winstonConfig.createLoggerConfig(MODULE));

    const moduleLogger = winston.loggers.get(MODULE);

    defaultLogger.info(`Error in ${MODULE}`);
    moduleLogger.error(
      `Error in ${req.originalUrl} ERROR: ${error}, STACK: ${error.stack}`
    );
    if (error.status == 404) {
      throw error;
    }
    res.status(500).send({
      status: 0,
      msg: "Error! Occurred Please try again.",
      error: error.stack,
    });
    next();
  },
};
