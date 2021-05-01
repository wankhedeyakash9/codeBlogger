// Get logger from external configuration source
const winstonConfig = require("../config/winston-config");

let defaultLogger = winstonConfig.defaultLogger;

// Get database configuration
const dbConfig = require("./db-config");

const knex = require("knex")({
  client: "mysql",
  connection: dbConfig,
  debug: process.env.KNEX_DEBUG, //set KNEX_DEBUG in env to enable debug
  // debug: true,
});

knex
  .raw("SELECT 1 + 1 AS solution")
  .then((results) => {
    // console.log("The solution is: ", results[0][0].solution);
    defaultLogger.info("MySql Connected using knex!...");
    defaultLogger.info(
      `Database: ${process.env.DATABASE_NAME || "ecomtrails_test"}`
    );
  })
  .catch((error) => {
    if (error) {
      defaultLogger.error("Database connection failed", error);
      throw error;
    }
  });

module.exports = knex;
