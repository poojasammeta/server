const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./model/user");
const bcrypt = require("bcrypt");
const session = require("express-session");
const userRoute = require("./controller/userRoute");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/userRoute", userRoute);

app.use(
  session({
    secret: "Emulsify",
    resave: false,
    saveUninitialized: false,
  })
);

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://FlavorhuB:Food@cluster0.sv2n0lt.mongodb.net/signup"
);

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new userModel({
      username,
      email,
      password: hash,
      isRegistered: true,
    });
    const result = await user.save();
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username: username });
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        req.session.isLoggedIn = true;
        req.session.username = username;
        res.json("Success");
      } else {
        res.json("The password is incorrect.");
      }
    } else {
      res.json("No record existed.");
    }
  } catch (err) {
    res.json(err);
  }
});

app.get("/homepage", (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("/homepage");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      res.status(500).json({ error: "Logout failed" });
    } else {
      res.json("/login");
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(4000, () => {
  console.log("server started at 4000");
});
