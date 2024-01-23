require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("./passport");
const endpoints = require("./endpoints");

const app = express();

const port = 20502;

app.use(cors());
app.use(
  session({
    secret: "voirdirevoirdire",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", endpoints);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
