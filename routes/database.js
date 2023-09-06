// get the client
const mysql = require("mysql2");

// create the connection to database
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "mb_lab",
});

module.exports = db.promise()


