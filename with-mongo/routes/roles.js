// control authz roles for users it's like IAM in GCP
const authz = require("../middlewares/authz");
const admin = require("../middlewares/admin");
const { Role, validate } = require("../models/role");
const express = require("express");
const router = express.Router();

// get available list of roles
router.get("/", [authz, admin], async (req, res) => {
  const roles = await Role.find();
  res.send(roles);
});
// add a new role
router.post("/", [authz, admin], async (req, res) => {
  // validate the body sent by the client
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if a role with the same name exist
  let role = await Role.findOne({ name: req.body.name });
  if (role) return res.status(400).send("This role exists");
  // create the new role and return it
  role = new Role({
    name: req.body.name,
  });

  await role.save();

  res.send(role);
});
// update a role
router.put("/:id", [authz, admin], async (req, res) => {
  // validate the req.body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if a role with the same new name exists
  let role = await Role.findOne({ name: req.body.name });
  if (role) return res.status(400).send("This role exists");

  // check if the role exists
  role = await Role.findById(req.params.id);
  if (!role) return res.status(404).send("Role was not found");
  // update the role
  role.set({
    name: req.body.name,
  });

  await role.save();

  res.send(role);
});
// remove a role
router.delete("/:id", [authz, admin], async (req, res) => {
  const role = await Role.findByIdAndRemove(req.params.id);
  if (!role) return res.status(404).send("Role was not found");

  res.send(role);
});

module.exports = router;
