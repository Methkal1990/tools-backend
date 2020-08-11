const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = () => {
  process.on("uncaughtException", (err) => {
    winston.error(err.message, err);
    setTimeout(() => {
      process.exit(1);
    }, 3000);
  });

  process.on("unhandledRejection", (err) => {
    winston.error(err.message, err);
    setTimeout(() => {
      process.exit(1);
    }, 3000);
  });

  // logging config with winston
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
  );
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/tools",
      level: "error",
    }),
  );
};
