const express = require("express");
const userSchema = require("../model/user");
const mongoose = require("mongoose");

const userRoute = express.Router();

// Create a new user
userRoute.post("/create-user", async (req, res) => {
  const user = new userSchema({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const newUser = await user.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Get all users
userRoute.get("/", async (req, res) => {
  try {
    const users = await userSchema.find().select("-password"); // exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get a single user by ID
userRoute.get("/:id", async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await userSchema.findById(id).select("-password"); // exclude password field
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Update a user
userRoute.put("/:id", async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await userSchema.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// Delete a user
userRoute.delete("/:id", async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await userSchema.findByIdAndRemove(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = userRoute;
