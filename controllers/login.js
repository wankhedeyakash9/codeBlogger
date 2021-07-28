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
  geoJsonFiles: async (req, res, next) => {
    try {
      if (!req.files) {
        return res
          .status(400)
          .send({ status: 0, message: "geojson file is required" });
      }

      const fs = require("fs");
      const data = req.files.geojson[0].buffer.toString();
      const test = JSON.parse(data);
      let result;
      let geoJson = { type: test.type, name: test.name, crs: test.crs };
      const stateGps3 = {
        comp_id: req.body.comp_id,
        type: req.body.type,
      };
      if (req.body.type !== "Y") {
        stateGps3.parent_id = req.body.parent_id;
        if (!stateGps3.parent_id) {
          return res
            .status(400)
            .send({ status: 0, message: "parent id is required" });
        }
      }
      if (req.body.type == "Y") {
        stateGps3.parent_id = 0;
      }
      let name = req.body.geoJsonParameterName;
      for (let key of test.features) {
        geoJson.features = [key];
        stateGps3.name = key.properties[name];
        fs.writeFileSync(
          `client/assets/${key.properties[name]}.json`,
          JSON.stringify(geoJson)
        );
        let path = `client/assets/${key.properties[name]}.json`;
        let link = {
          link: path,
        };
        stateGps3.details = JSON.stringify(link);
        // stateGps3.details = JSON.stringify(
        //   `client/assets/${key.properties[name]}.json`
        // );

        await login.insertData("gps3", stateGps3);
      }
      res.send({ msg: "file created successfully" });
    } catch (error) {
      return next(error);
    }
  },
  sharedPost: async (req, res, next) => {
    try {
      let where = {};
      let inst = {};
      where["posts.id"] = req.body.id;
      where["posts.person_id"] = req.body.person_id;
      where["posts.is_active"] = "Y";
      if (!where["posts.person_id"]) {
        return res
          .status(200)
          .send({ status: 0, message: "person_id is required" });
      }
      if (!where["posts.id"]) {
        return res
          .status(200)
          .send({ status: 0, message: "post_id is required" });
      }
      let result = await login.selectData(
        ["posts.*", "person.name"],
        "posts",
        where
      );

      inst["shared_person_id"] = req.body.shared_person_id;
      if (result.length) {
        inst["post_id"] = result[0].id;
        inst["person_id"] = result[0].person_id;
      }

      let results = await login.insertData("shared", inst);
      if (results) {
        res.send({ status: 1, msg: "succesfull" });
      } else {
        res.send({ status: 0, msg: "unable to fetch" });
      }
    } catch (error) {
      return next(error);
    }
  },
  sharedPostdata: async (req, res, next) => {
    try {
      let where = {};
      where["shared.id"] = req.body.id;
      if (!where["shared.id"]) {
        return res
          .status(200)
          .send({ status: 0, message: "shared.id is required" });
      }
      let result = await login.selectPost(
        ["posts.*", "shared.id as shared_id", "shared.shared_person_id"],
        "shared",
        where
      );
      if (result) {
        res.send({ status: 1, msg: "succesfull", data: result });
      } else {
        res.send({ status: 0, msg: "unable to fetch" });
      }
    } catch (error) {
      return next(error);
    }
  },
  addPost: async (req, res, next) => {
    try {
      let data = {};
      data["person_id"] = req.body.person_id;
      data["comp_id"] = req.body.comp_id;
      data["group_id"] = req.body.group_id;
      data["title"] = req.body.title;
      data["content"] = req.body.content;
      data["embeded_link"] = req.body.embeded_link;
      data["doa"] = moment().format("YYYY-MM-DD");
      data["is_active"] = "Y";
      if (req.file) {
        let fileName = req.file.originalname;
        let folder = `Post/`;
        let imageName = `${folder}${fileName}`;
        // await sendFile(imageName, req.file.buffer);
        data["link"] = imageName;
      }
      let insert = await login.insertData("posts", data);
      if (insert) {
        res.send({
          status: 1,
          msg: "insert successfully",
        });
      } else {
        res.send({
          status: 0,
          msg: "failed",
        });
      }
    } catch (error) {
      return next(error);
    }
  },
  fetchPost: async (req, res, next) => {
    try {
      let where = {};
      where["posts.comp_id"] = req.body.comp_id;
      where["posts.person_id"] = req.body.person_id;
      where["posts.is_active"] = "Y";
      if (!where["posts.person_id"]) {
        return res
          .status(200)
          .send({ status: 0, message: "person_id is required" });
      }
      if (!where["posts.comp_id"]) {
        return res
          .status(200)
          .send({ status: 0, message: "comp_id is required" });
      }
      let result = await login.selectData(
        ["posts.*", "person.name"],
        "posts",
        where
      );
      for (let ele of result) {
        if (ele.embeded_link) {
          ele.embeded_link = ele.embeded_link.replace("watch?v=", "embed/");
        }
      }
      for (let key of result) {
        if (key.link) {
          let im = key.link;

          // key.link = await getFile(im);
        }
      }
      if (result) {
        res.send({ data: result, status: 1, msg: "succesfull" });
      } else {
        res.send({ status: 0, msg: "unable to fetch" });
      }
    } catch (error) {
      return next(error);
    }
  },
  fetchLog: async (req, res, next) => {
    try {
      const { cont_number, password, otp } = req.body;
      if (!(cont_number && (password || otp))) {
        return res.json({
          status: 10,
          msg: "Contact No. and Password and/or otp required.",
        });
      }

      if (cont_number.toString().length != 10) {
        return res.json({
          status: 10,
          msg: "Please enter a 10-digit Contact No.",
        });
      }

      const checkMobile = await User.CheckMobile(req.body);
      let key = await User.fetchKey();

      if (!checkMobile.length) {
        //cont_number exists in db
        if (!otp) {
          return res.json({
            status: 1,
            msg: "Please register.",
          });
        } else {
          const verifyOtp = await User.CheckOtp(req.body); //verify otp
          if (!verifyOtp) {
            return res.json({
              status: 3,
              msg: "Wrong otp.",
            });
          } else {
            //otp matched

            if (!password) {
              return res.json({
                status: 10,
                msg: "Password required.",
              });
            }
            //register
            const getParentUserNum = await UserRegistration.getuser_num();
            if (!getParentUserNum) {
              return res.json({
                status: 4,
                msg: "Error while getting User_num",
              });
            }
            let user_num = getParentUserNum[0].maxusernum;
            req.body["user_num"] = user_num;
            const insertParentUserNum = await UserRegistration.insertuser_num(
              user_num
            );
            if (!insertParentUserNum) {
              return res.json({
                status: 4,
                msg: "Error while inserting user_num in parent_user_num table",
              });
            }

            const user = await UserRegistration.registerUser(req.body);
            const registeredUser = await User.getRegisteredUser(req.body);
            if (!registeredUser.length) {
              return res.json({
                status: 4,
                msg: "User registration failed",
              });
            }
            //and login
            const token = jwt.sign({ cont_number }, jwtKey, {
              algorithm: "HS256",
              expiresIn: "24h",
            });
            return res.json({
              status: 0,
              msg: "Registered and Logged in successfully.",
              token: token,
              data: registeredUser[0],
            });
          }
        }
      } else {
        //cont_number exists in db
        const name = checkMobile[0].name;
        if (!password) {
          return res.json({
            status: 10,
            msg: "Password required.",
          });
        }

        const hashedPassword = crypto
          .createHmac("sha256", secret)
          .update(password)
          .digest("hex");

        if (hashedPassword == checkMobile[0].password) {
          //login
          const token = jwt.sign({ name }, jwtKey, {
            algorithm: "HS256",
            expiresIn: "24h",
          });
          delete checkMobile[0].password;
          return res.json({
            status: 0,
            msg: "Logged in successfully.",
            token: token,
            // apiKey :  key[0].key,
            data: checkMobile[0],
          });
        } else {
          //password doesn't match
          if (otp) {
            const verifyOtp = await User.CheckOtp(req.body); //verify otp
            if (!verifyOtp) {
              return res.json({
                status: 3,
                msg: "Wrong otp.",
              });
            } else {
              //otp matched
              //update password
              const updatePassword = await User.updatePassword(req.body);

              const token = jwt.sign({ name }, jwtKey, {
                algorithm: "HS256",
                expiresIn: "24h",
              });
              delete checkMobile[0].password;
              // and login
              return res.json({
                status: 0,
                msg: "Logged in successfully.",
                token: token,
                // apiKey : key[0].key,
                data: checkMobile[0],
              });
            }
          } else {
            //otp not present
            return res.json({
              status: 2,
              msg: "Please verify device.",
            });
          }
        }
      }
    } catch (err) {
      return next(err);
    }
  },
};
