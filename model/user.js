const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
  },
  {
    collection: "users",
    timestamps: false,
  }
);

const userModel = mongoose.model("Userss", userSchema);
module.exports = userModel;
