const express = require("express");
const passport = require("./passport");
const connection = require("./connection");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

/* USER ENDPOINTS
Purpose: Authenticating a login using the local strategy in passport.js
Parameters: NONE
*/
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

/* LECTURER ENDPOINTS
Purpose: To get all users with the role of 2 (Lecturers), listed in the admin page
Parameters: NONE
*/
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
/*
Purpose: To get a single lecturer by their user_id, used in the admin page
Parameters: NONE
*/
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

/*
Purpose: For creating a new lecturer in the system
Parameters: first name, last name, email and password
*/
app.post("/lecturer/create", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error hashing password" });
    }
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
            "INSERT INTO users (first_name, last_name, email, role, password) VALUES (?, ?, ?, 2, ?)",
            [first_name, last_name, email, hash],
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
});

/* STUDENT ENDPOINTS
Purpose: Gets all the students with results from the current year (i.e all current students for this year)
Parameters: NONE
*/
app.get("/students/all", async (req, res) => {
  connection.query(
    "SELECT students.* from students WHERE students.reg_number in (SELECT reg_number FROM results WHERE Year = 2024)",
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(result);
    }
  );
});

/*
Purpose: For getting all students in classes taught by a lecturer
Parameters: user_id of lecturer
*/
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

/*
Purpose: For bulk inserting new students into the system from a csv file
Parameters: An array of students (reg numbers, names, degree names and degree levels)
*/
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
      return res.status(201).json({
        success: true,
        message: "Student inserted successfully",
      });
    }
  });
});

/*
Purpose: For clearing any students in the system who do not have marks (i.e old students/historical outdated data)
Parameters: NONE
*/
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
        return res.status(204).json({
          success: true,
          message: "Cleared excess students",
        });
      }
    }
  );
});

/* RESULTS ENDPOINTS
Purpose: For getting all results in the system
Parameters: NONE
*/
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
/*
Purpose: For getting all results of a student from a specific year (Typically the current year but can be open to historical look ups)
Parameters: Registration number of the student and the year
*/
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
/*
Purpose: For getting all the results of the classes taught by a lecturer (I.e Lecturer viewing the results of their classes)
Parameters: User_id of the lecturer
*/
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

/*
Purpose: For bulk inserting an array of results of students, typically from a csv file
Parameters: An array of results (class code, registration number of the student, mark, unique code and the year of result)
*/
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
      return res.status(201).json({
        success: true,
        message: "Results inserted successfully",
      });
    }
  });
});
/*
Purpose: For returning dynamically filtered results data for the analytics page
Parameters: NONE
Side note: This one endpoint and logic took me roughly 3, 6 hour days to get working as I refused to handle the request in the front end nor create 25 endpoints for each filter combination
*/
app.post("/results/queried", async (req, res) => {
  const { class: classFilter, course, degreeLevel, year } = req.body;
  let query = `
    SELECT results.result_id, results.class_code, results.reg_number, results.mark, results.unique_code, results.year, students.degree_name, students.degree_level
    FROM results
    INNER JOIN students ON results.reg_number = students.reg_number
  `;
  //To avoid using 5^2 endpoints it can be reduced to this single endpoint by just dynamically building the query depending on the parameters taht are passed into the body of the request
  const params = [];
  //This approach allows any combination of filters to be put onto request. This is the benefit of using raw SQL over ORMs is that it can be as simple as a string builder
  if (classFilter) {
    params.push(`results.class_code = '${classFilter}'`);
  }
  if (year) {
    params.push(`results.year = '${year}'`);
  }
  if (degreeLevel) {
    params.push(`students.degree_level = '${degreeLevel}'`);
  }
  if (course) {
    params.push(`students.degree_name = '${course}'`);
  }
  //params.join allows each of the parameters (if any) to be joined by an AND. This allows for any amount of filters in the request
  if (params.length > 0) {
    query += " WHERE " + params.join(" AND ");
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
/*
Purpose: For bulk returning all results from a group of registration numbers
Parameters: An array of registration numbers of students to get results from
Side note: This is also a dynamic query similar to /results/queried, it will generate as many placeholders as there are regNumbers
*/
app.post("/results/regnumbers", async (req, res) => {
  const regNumbers = req.body;
  //Creates as many '?' placeHolders in the query as there are registration numbers
  const placeholders = regNumbers.map(() => "?").join(",");
  //This approach allows any number of students to have their results queried
  //Another simplified approach to reduce the front end load and the amount of endpoints required
  const queryString = `SELECT * FROM results WHERE reg_number IN (${placeholders})`;
  connection.query(queryString, regNumbers, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      return res.status(404).json({ error: "No results found" });
    } else {
      return res.json(results);
    }
  });
});

/* CLASSES ENDPOINTS
Purpose: Gets all the classes in the database
Parameters: NONE
*/
app.get("/classes", async (req, res) => {
  connection.query("SELECT * from classes", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json(result);
  });
});
/*
Purpose: To get a specific class by it's class code
Parameters: Class code
Side note: The route had to be '/classes/code/:classCode' as it conflicted with '/classes/:userId' and to provide clarity
*/
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
/*
Purpose: To get a specific class by it's lecturer/user assigned to it
Parameters: User Id
Side note: The route had to be '/classes/user/:userId' as it conflicted previously with '/classes/:classCode' and to provide clarity
*/
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
        return res.status(404).json({ error: "No classes found" });
      }
      return res.json(result);
    }
  );
});
/*
Purpose: To update a specific class by it's class code
Parameters: Class name, credit level, credits, user_id(Lecturer) and the class code to specific the class to be updated
*/
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
        return res.status(204).json({
          success: true,
          message: "Class updated successfully",
        });
      }
    }
  );
});
/*
Purpose: To create a new class in the system
Parameters: Class code, Class name, credit level, credits, locked state (Always 0) and the Lecturer (User_id of lecturer)
*/
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
        return res.status(201).json({
          success: true,
          message: "Class created successfully",
        });
      }
    }
  );
});
/*
Purpose: To change the locked status of a class 
Parameters: The classcode of the class to be locked and the new locked state (Either 0 or 1)
*/
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
      return res
        .status(204)
        .json({ success: true, message: "Updated class successfully" });
    }
  });
});
/*
Purpose: To reset every lecturer assigned to every class (I.e new academic year and new lecturers of each class)
Parameters: NONE
*/
app.get("/classes/reset", (req, res) => {
  connection.query("UPDATE classes SET user_id = NULL", (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to reset class",
      });
    } else {
      return res.status(204).json({
        success: true,
        message: "Reset all classes successfully",
      });
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;
