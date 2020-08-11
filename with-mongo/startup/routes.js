const tools = require("../routes/tools");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middlewares/error");
const express = require("express");
const helmet = require("helmet");

module.exports = (app) => {
  // parse the req.body if it has json data
  app.use(express.json());

  // use helmet to secure the app by setting various HTTP headers
  app.use(helmet());

  app.use("/api/tools", tools);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
