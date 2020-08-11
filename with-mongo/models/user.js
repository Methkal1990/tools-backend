const config = require("config");
const jwt = require("jsonwebtoken");
const debugAuth = require("debug")("app:auth");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false },
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey"),
  );
  debugAuth(`token is ${token}`);
  return token;
};

const User = mongoose.model("User", userSchema);

const userValidator = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
};

module.exports.User = User;
module.exports.validate = userValidator;
