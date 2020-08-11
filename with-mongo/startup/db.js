const winston = require("winston");
const mongoose = require("mongoose");

module.exports = () => {
  // connect to mongoose
  mongoose
    .connect("mongodb://localhost/tools", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => winston.info("Connected to mongodb"));
};
