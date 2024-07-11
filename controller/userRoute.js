const express = require("express");
const userSchema = require("../model/userSchema");
const userRoute = express.Router();
const mongoose = require("mongoose");

userRoute.post("/create-user", async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const user = await userSchema.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
});

userRoute.get("/", async (req, res) => {
  try {
    const users = await userSchema.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

userRoute
  .route("/update-user/:id")
  .get(async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const user = await userSchema.findById(id);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Error fetching user" });
    }
  })
  .put(async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const user = await userSchema.findByIdAndUpdate(id, { $set: req.body });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Error updating user" });
    }
  });

userRoute.delete("/delete-user/:id", async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await userSchema.findByIdAndRemove(id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = userRoute;
