const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const debugDB = require("debug")("app:db");
const debugApp = require("debug")("app:app");
const tools = require("./routes/tools");
const express = require("express");
const app = express();

// connect to mongoose
mongoose
  .connect("mongodb://localhost/tools", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

const port = process.env.PORT || 3000;

app.listen(port, () => debugApp(`listening on port ${port}!`));
