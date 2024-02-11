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

app.get("/allstudents", async (req, res) => {
  connection.query("SELECT * from students", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(result);
  });
});

app.get("/results", async (req, res) => {
  connection.query("SELECT * from results", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(result);
  });
});

app.get("/lecturers", async (req, res) => {
  connection.query(
    "SELECT * from users where role = 1",
    (err, results, fields) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(results);
    }
  );
});

app.get("/classes", async (req, res) => {
  connection.query("SELECT * from classes", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(result);
  });
});

app.get("/classes/:classCode", async (req, res) => {
  const classCode = req.params.classCode;
  const query = "SELECT * from classes WHERE class_code = ?";
  connection.query(query, [classCode], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }
    return res.json(result);
  });
});

app.get("/classesByUser/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  connection.query(
    "SELECT * from classes WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (result.length === 0) {
        return res.status(200).json({ error: "No classes found" });
      }
      return res.json(result);
    }
  );
});

app.get("/lecturers/:userId", async (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * from users WHERE user_id = ?";
  connection.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (res.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(result);
  });
});

app.get("/results", async (req, res) => {
  const query = "SELECT * from results";
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    } else if (res.length == 0) {
      return res.status(404).json({ error: "No results found" });
    } else {
      return res.json(result);
    }
  });
});

// app.get("/results/:userId", async (req, res) => {
//   const userId = res.query.userId;
//   const query =
//     "SELECT results.result_id, results.class_code, results.mark, results.reg_number, results.unique_code FROM results JOIN classes   ON results.class_code = classes.class_code  WHERE classes.user_id = ?";
//   connection.query(query, [userId], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: "Internal Server Error" });
//     } else if (res.length == 0) {
//       return res.status(404).json({ error: "No results found" });
//     } else {
//       return res.json(result);
//     }
//   });
// });

app.post("/lecturer/create", async (req, res) => {
  const { first_name, last_name, email } = req.body;
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error checking email" });
      }

      if (result.length > 0) {
        return res
          .status(500)
          .json({ success: false, message: "Email already in use" });
      } else {
        connection.query(
          "INSERT INTO users (first_name, last_name, email, role) VALUES (?, ?, ?, 1)",
          [first_name, last_name, email],
          (insertErr, insertResult) => {
            if (insertErr) {
              return res
                .status(500)
                .json({ success: false, message: "Failed to add Lecturer" });
            }
            return res.status(201).json({
              success: true,
              message: "Lecturer created successfully",
            });
          }
        );
      }
    }
  );
});

app.post("/class/update", (req, res) => {
  const { className, credits, lecturer, classCode, creditLevel } = req.body;
  connection.query(
    "UPDATE classes SET class_name = ?, credit_level = ?, credits = ?, user_id = ? WHERE class_code = ?",
    [className, creditLevel, credits, lecturer, classCode],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to update class",
          error: error.message,
        });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
        });
      } else {
        return res.json({
          success: true,
          message: "Class updated successfully",
        });
      }
    }
  );
});

app.post("/classes/create", (req, res) => {
  const { classCode, className, creditLevel, credits, locked, lecturer } =
    req.body;
  connection.query(
    "INSERT INTO classes(class_code, class_name, credit_level, credits, locked, user_id) VALUES (?,?,?,?,?,?)",
    [classCode, className, creditLevel, credits, false, lecturer],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to update class",
          error: error.message,
        });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
        });
      } else {
        return res.json({
          success: true,
          message: "Class updated successfully",
        });
      }
    }
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;
