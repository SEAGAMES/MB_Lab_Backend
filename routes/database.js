// get the client
const mysql = require("mysql2");

// Common pool configuration
const commonPoolConfig = {
  host: "localhost",
  user: "root",
  password: ""
};

// ใส่ชื่อ DB ใหม่ตรงนี้
const databaseNames = ["mb_lab", "mb_certificate"];
const databasePools = {};

for (const dbName of databaseNames) {
  databasePools[dbName] = mysql.createPool({
    ...commonPoolConfig,
    database: dbName
  });
}

// Export an object containing all the database pools
module.exports = Object.fromEntries(
  databaseNames.map((dbName) => [
    dbName,
    databasePools[dbName].promise()
  ])
);
