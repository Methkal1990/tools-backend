const winston = require("winston/lib/winston/config");

const winsto = require("winston");


module.exports = (err, req, res, next) => {
  winsto.error(err.message, err);
  res.status(500).send("Something went wrong on the server");
};

