const authZ = require("../middlewares/authz");
const admin = require("../middlewares/admin")
const { Tool, validate } = require("../models/tool");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const tools = await Tool.find().sort("-date");
  res.send(tools);
});

router.get("/:id", async (req, res) => {
  const tool = await Tool.findById(req.params.id);
  if (!tool) return res.status(404).send("Tool was not found");

  res.send(tool);
});

router.post("/", authZ, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const tool = new Tool({
    name: req.body.name,
  });

  await tool.save();

  res.send(tool);
});

router.put("/:id", authZ, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const tool = await Tool.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true },
  );

  if (!tool) return res.status(404).send("Tool was not found");

  res.send(tool);
});

router.delete("/:id", [authZ, admin], async (req, res) => {
  const tool = await Tool.findByIdAndRemove(req.params.id);
  if (!tool) return res.status(404).send("Tool was not found");

  res.send(tool);
});

module.exports = router;
