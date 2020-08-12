const authz = require("../middlewares/authz");
const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const router = express.Router();

// get the current user
router.get("/me", authz, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

// update the current user
router.put("/me", authz, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findById(req.user._id);

  if (req.body.email !== user.email) {
    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist)
      return res.status(400).send("email provided is already used");
  }

  const salt = await bcrypt.genSalt(10);

  req.body.password = await bcrypt.hash(req.body.password, salt);

  user.set({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  await user.save();

  res.send(user);
});
// register a user --> sign up
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send("user is already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

// get a specific user --> admin
// get all users --> admin
// remove a user --> admin

module.exports = router;
