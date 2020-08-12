const config = require("config");

module.exports = () => {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL: jwtPrivateKey is missing");
  }
};
