const express = require("express");
const passport = require("./passport");
const connection = require("./connection");

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      if (info && info.message) {
        return res.status(400).json({ success: false, message: info.message });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Authentication failed." });
      }
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      return res.json({ success: true, user: req.user });
    });
  })(req, res, next);
});

app.get("/userauth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

app.get("/getlecturer", async (req, res) => {
  connection.query(
    "SELECT * FROM users WHERE role = ?",
    (err, results, fields) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return res.json(results);
    }
  );
});

app.get("/students", async (req, res) => {
  connection.query("SELECT * from students", (err, results, fields) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(results);
  });
});

app.get("/results", async (req, res) => {
  connection.query("SELECT * from results", (err, results, fields) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(results);
  });
});

app.get("/classes", async (req, res) => {
  connection.query("SELECT * from classes", (err, results, fields) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(results);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;
