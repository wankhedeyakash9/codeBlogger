require("dotenv").config();

// Get logger from external configuration source
const winstonConfig = require("./config/winston-config");

let defaultLogger = winstonConfig.defaultLogger;

const express = require("express");
const app = express();

//BodyParser
const bodyParser = require("body-parser");

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Enabling CORS
const cors = require("cors");
app.use(cors());

// eslint-disable-next-line no-console
console.log(`CORS enabled`);

//Enabling morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// eslint-disable-next-line no-console
console.log(`MORGAN enabled`);

//Enabling swaggerDoc
const swaggerDoc = require("./swagger");
swaggerDoc(app);

/**
 * setting include keyword with a global path
 * i.e app's root using app-root-path library
 * that will help requiring file with absolute path
 *
 */
//check if doesn't already exists
global.include || (global.include = require("app-root-path").require);

//Loading routes
require("./loaders/routes")(app);

const PORT = process.env.PORT || 8081;

app.listen(PORT, (req, res) =>
  defaultLogger.info(`Listening on PORT ${PORT}...`)
);
