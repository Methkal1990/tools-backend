const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
  },
  {
    versionKey: false,
  },
);

const Role = mongoose.model("Role", roleSchema);

const roleValidator = (role) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(role);
};

exports.Role = Role;
exports.validate = roleValidator;
