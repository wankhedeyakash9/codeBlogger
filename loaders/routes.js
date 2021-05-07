module.exports = function (app) {
  app.use(require("../routes"));
  app.use("/login", require("../routes/login"));

  //Some error
  app.use((req, res, next) => {
    const error = new Error();
    error.status = 404;
    error.message = "404 NOT FOUND";
    next(error);
  });
};
