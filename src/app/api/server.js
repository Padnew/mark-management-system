require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const connection = mysql.createPool({
  host: process.env.SERVER_HOST,
  user: process.env.SERVER_USER,
  password: process.env.SERVER_PASSWORD,
  database: process.env.SERVER_DATABASE,
});

const app = express();
app.use(cors());
app.use(express.json());
const port = 20502;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/getlecturer", async (req, res) => {
  connection.query(
    "SELECT * FROM users WHERE role = 1",
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

module.exports = app;
