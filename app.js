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

//========================================================================
//fyi https://www.npmjs.com/package/express-session
//initialize session, use session package required above
app.use(
  session({
    secret: "marketplace secret",
    resave: false,
    saveUninitialized: false,
  })
);
//========================================================================

//fyi https://www.npmjs.com/package/passport-local-mongoose
//initialize passport package
app.use(passport.initialize());
//use passport to deal with session
app.use(passport.session());
//========================================================================

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

//========================================================================
//salts and hashes for you, and saving into mongodb database
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const User = new mongoose.model("User", userSchema);

//========================================================================
//using passport for serialization
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  console.log("Serializing user:", user);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("Deserializing user by ID:", id);
  User.findById(id)
    .then(function (user) {
      console.log("Deserialized user:", user);
      done(null, user);
    })
    .catch(function (err) {
      console.error("Error deserializing user:", err);
      done(err, null);
    });
});
//========================================================================

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

app.get("/success", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("success");
  } else {
    res.redirect("/login");
  }
});

app.post("/signup", function (req, res) {
  User.register(
    { email: req.body.email },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/signup");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/success");
        });
      }
    }
  );
});

app.post("/login", function (req, res) {
  //
});

app.listen(3000, function () {
  console.log("server started on port 3k");
});
