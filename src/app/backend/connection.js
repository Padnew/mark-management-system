require("dotenv").config();

const mysql = require("mysql2");

//All connection details are stored in a .env file for security
const connection = mysql.createPool({
  host: process.env.SERVER_HOST,
  user: process.env.SERVER_USER,
  password: process.env.SERVER_PASSWORD,
  database: process.env.SERVER_DATABASE,
});

module.exports = connection;
