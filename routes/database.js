// get the client
const mysql = require("mysql2");

// create the connection to database
const mb_lab = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "mb_lab",
});

module.exports = mb_lab.promise()

