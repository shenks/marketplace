//importing packages & env config
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//for session management
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//oauth
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const findOrCreate = require("mongoose-findorcreate");
//

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public", { maxAge: 0 }));

//initialize session, use session package required above
app.use(
  session({
    secret: "marketplace secret",
    resave: false,
    saveUninitialized: false,
  })
);

//mongoose connection
mongoose.connect(
  "mongodb+srv://shenkslee:marketplacepassword@cluster0.kd7k2fx.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

//user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

//routes
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/signup", function (req, res) {
  //
});

app.post("/login", function (req, res) {
  //
});

app.listen(3000, function () {
  console.log("server started on port 3k");
});
