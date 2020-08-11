const config = require("config");
const morgan = require("morgan");
module.exports = (app) => {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL: jwtPrivateKey is missing");
  }

  // in production env apply these middlewares
  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
  }
};
