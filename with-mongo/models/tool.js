const debugDB = require("debug")("app:db");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    creation_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

const Tool = mongoose.model("Tool", toolSchema);

const toolValidator = (tool) => {
  debugDB(tool);
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(tool);
};

exports.Tool = Tool;
exports.validate = toolValidator;
