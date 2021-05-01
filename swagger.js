const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  info: {
    title: "codeBlogger_apis",
    version: "1.0.0",
    description: "",
  },
  basePath: "/",
  servers: [
    {
      url: `http://localhost:8081`,
    },
  ],
};
const option = {
  swaggerDefinition,
  apis: ["./ecom.js", "./routes/*.js", "./loaders/routes.js"],
};

const swaggerSpec = swaggerJsDoc(option);

module.exports = (app) => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};
