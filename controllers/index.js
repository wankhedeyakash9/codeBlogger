// Get logger from external configuration source
const dbmodel = require("../models");

const winstonConfig = require("../config/winston-config");
let defaultLogger = winstonConfig.defaultLogger;

// Add another logger with the category specific to this module
const winston = require("winston");

const MODULE = "controllers/index";
winston.loggers.add(MODULE, winstonConfig.createLoggerConfig(MODULE));
// Module-specific logger
const moduleLogger = winston.loggers.get(MODULE);

/**
 *companyDetails Controller
 */
module.exports = {
  /**
   * @author @aakashWankhede
   *  controller
   */
  health: async (req, res) => {
    res.status(200).send("HEALTHY");
  },
};
