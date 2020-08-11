const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const debugDB = require("debug")("app:db");
const debugApp = require("debug")("app:app");
const config = require("config");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middlewares/error");
require("express-async-errors");
const tools = require("./routes/tools");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const app = express();

if (!config.get("jwtPrivateKey")) {
  debugApp("FATAL: jwtPrivateKey is missing");
  process.exit(1);
}

process.on("uncaughtException", (err) => {
  winston.error(err.message, err, () => {
    process.exit(1);
  });
});

process.on("unhandledRejection", (err) => {
  winston.error(err.message, err, () => {
    process.exit(1);
  });
});

// logging config with winston
winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost/tools",
    level: "error",
  }),
);

// connect to mongoose
mongoose
  .connect("mongodb://localhost/tools", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => debugDB("Connected to mongodb"))
  .catch((err) => debugDB(err));

// parse the req.body if it has json data
app.use(express.json());

// use helmet to secure the app by setting various HTTP headers
app.use(helmet());

// in production env apply these middlewares
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

app.use("/api/tools", tools);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

const port = process.env.PORT || 3000;

app.listen(port, () => debugApp(`listening on port ${port}!`));
