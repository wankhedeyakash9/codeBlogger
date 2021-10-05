const login = require("../models");

// require signToken from jwt
const bcrypt = require("bcrypt");
const saltRounds = 10;

// require helpers
// const { sendMail } = require("../helper/mail");
// const { sendSMS } = require("../helper/sms");
// const { titleCase } = require("../helper/utils");

const winston = require("winston");
// Get logger from external configuration source
const winstonConfig = require("../config/winston-config");
const moment = require("moment-timezone");
const { Console } = require("winston/lib/winston/transports");

const MODULE = "controllers/login";
// Add another logger with the category specific to this module
winston.loggers.add(MODULE, winstonConfig.createLoggerConfig(MODULE));
// Module-specific logger

module.exports = {
  /**
   * login controller
   */
  register: async (req, res, next) => {
    try {
      let dataresponse = {};
      let where = {};
      where["email"] = req.body.email;
      where["is_active"] = "Y";
      let userExist = await login.select("email", "users", where);
      console.log(userExist);
      if (userExist.length) {
        dataresponse["status"] = 2;
        dataresponse["message"] = "User Already Exist";
        return res.send(dataresponse);
      }
      const password = req.body.password;
      const encryptedPassword = await bcrypt.hash(password, saltRounds);
      let data = {
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword,
        created_at: moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
      };
      let insert = await login.insert("users", data);
      if (insert) {
        dataresponse["status"] = 1;
        dataresponse["message"] = "User Insert Successfully";
        res.send(dataresponse);
      } else {
        dataresponse["status"] = 0;
        dataresponse["message"] = "Unable To Insert";
        res.send(dataresponse);
      }
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      let dataresponse = {};
      let where = {};
      let email = req.body.email;
      let password = req.body.password;
      where["email"] = email;

      where["is_active"] = "Y";
      console.log(where);
      let result = await login.select(
        ["id", "name", "email", "is_active"],
        "users",
        where
      );

      if (result.length) {
        let pass = await login.select("*", "users", where);
        const comparison = await bcrypt.compare(password, pass[0].password);
        if (comparison) {
          dataresponse["status"] = 1;
          dataresponse["data"] = result;
          dataresponse["message"] = "Login Successfull";
          return res.send(dataresponse);
        } else {
          dataresponse["status"] = 0;
          dataresponse["message"] = "Email and password does not match";
          return res.send(dataresponse);
        }
      } else {
        dataresponse["status"] = 0;
        dataresponse["message"] = "Email Doesn't Exist";
        res.send(dataresponse);
      }
    } catch (error) {
      next(error);
    }
  },
};
