const express = require("express");
const passport = require("./passport");
const connection = require("./connection");
const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//USER ENDPOINTS
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

// LECTURER ENDPOINTS
app.get("/lecturers", async (req, res) => {
  connection.query(
    "SELECT * from users where role = 2",
    (err, results, fields) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(results);
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
          "INSERT INTO users (first_name, last_name, email, role) VALUES (?, ?, ?, 2)",
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

// STUDENT ENDPOINTS
app.get("/students/all", async (req, res) => {
  connection.query("SELECT * from students", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(result);
  });
});

app.get("/students/user/:userId", async (req, res) => {
  const { userId } = req.params;
  connection.query(
    "SELECT s.* FROM students s JOIN results r ON s.reg_number = r.reg_number JOIN classes c ON r.class_code = c.class_code WHERE c.user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(result);
    }
  );
});

app.post("/students/create", (req, res) => {
  const students = req.body;

  const sql =
    "INSERT INTO students(reg_number, name, degree_name, degree_level) VALUES ?";
  const values = students.map((student) => [
    student.reg_number,
    student.name,
    student.degree_name,
    student.degree_level,
  ]);

  connection.query(sql, [values], (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to insert student",
        error: error.message,
      });
    } else {
      return res.json({
        success: true,
        message: "Student inserted successfully",
      });
    }
  });
});

app.delete("students/clear", (res, req) => {
  connection.query(
    "DELETE FROM students WHERE reg_number NOT IN (SELECT reg_number FROM Results)",
    (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to remove students",
          error: error.message,
        });
      } else {
        return res.json({
          success: true,
          message: "Cleared excess students",
        });
      }
    }
  );
});

// RESULTS ENDPOINTS
app.get("/results", async (req, res) => {
  connection.query("SELECT * from results", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    } else if (res.length == 0) {
      return res.status(404).json({ error: "No results found" });
    } else {
      return res.json(result);
    }
  });
});

app.post("/results/detailed", async (req, res) => {
  const { regNumber, year } = req.body;
  connection.query(
    "SELECT * from results WHERE reg_number = ? AND Year = ?",
    [regNumber, year],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      } else if (res.length == 0) {
        return res.status(404).json({ error: "No results found" });
      } else {
        return res.json(result);
      }
    }
  );
});

app.get("/results/:userId", async (req, res) => {
  const { userId } = req.params;
  const query =
    "SELECT results.result_id, results.class_code, results.mark, results.reg_number, results.unique_code FROM results JOIN classes ON results.class_code = classes.class_code  WHERE classes.user_id = ?";
  connection.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    } else if (res.length == 0) {
      return res.status(404).json({ error: "No results found" });
    } else {
      return res.json(result);
    }
  });
});

app.post("/results/create", async (req, res) => {
  const results = req.body;
  const query =
    "INSERT INTO results(class_code, reg_number, mark, unique_code, year) VALUES ?";
  const values = results.map((result) => [
    result.class_code,
    result.reg_number,
    result.mark,
    result.unique_code,
    result.year,
  ]);
  connection.query(query, [values], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to insert result",
        error: error.message,
      });
    } else {
      return res.json({
        success: true,
        message: "Results inserted successfully",
      });
    }
  });
});

app.post("/results/queried", async (req, res) => {
  const { class: classFilter, course, degreeLevel, year } = req.body;

  let query = `
    SELECT r.result_id, r.class_code, r.reg_number, r.mark, r.unique_code, r.year, s.degree_name, s.degree_level
    FROM results r
    INNER JOIN students s ON r.reg_number = s.reg_number
  `;
  const conditions = [];

  if (classFilter) {
    conditions.push(`r.class_code = '${classFilter}'`);
  }
  if (year) {
    conditions.push(`r.year = '${year}'`);
  }
  if (degreeLevel) {
    conditions.push(`s.degree_level = '${degreeLevel}'`);
  }
  if (course) {
    conditions.push(`s.degree_name = '${course}'`);
  }
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    } else if (result.length == 0) {
      return res.status(404).json({ message: "No results found" });
    } else {
      return res.json(result);
    }
  });
});

// CLASSES ENDPOINTS
app.get("/classes", async (req, res) => {
  connection.query("SELECT * from classes", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(result);
  });
});

app.get("/classes/code/:classCode", async (req, res) => {
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

app.get("/classes/user/:userId", async (req, res) => {
  const { userId } = req.params;
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

app.post("/classes/update", (req, res) => {
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
          message: "Failed to create class",
          error: error.message,
        });
      } else {
        return res.json({
          success: true,
          message: "Class created successfully",
        });
      }
    }
  );
});

app.post("/classes/locked", (req, res) => {
  const { classCode, lockedNumber } = req.body;
  const query = "UPDATE classes SET locked = ? WHERE class_code = ?";
  connection.query(query, [lockedNumber, classCode], (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update class",
      });
    } else {
      return res.json({ success: true, message: "Updated class successfully" });
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;
