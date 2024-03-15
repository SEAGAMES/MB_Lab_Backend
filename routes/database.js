// get the client
const mysql = require("mysql2");

// Common pool configuration
const commonPoolConfig = {
  host: "localhost",

  user: "root",
  password: "Password@1", // for server
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0
};

// ใส่ชื่อ DB ใหม่ตรงนี้
const databaseNames = ["usermb", "mb_policy", "mb_lab", "mb_certificate", 'mb_academic'];
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

// const mb_certificate_DB = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: 'Password@1',
//   database: "mb_certificate",
//   waitForConnections: true,
//   connectionLimit: 2,
//   queueLimit: 0

// })

// module.exports = { mb_certificate:mb_certificate_DB }