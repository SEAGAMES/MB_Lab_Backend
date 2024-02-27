var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var mb_policy = require('./routes/mb_policy')
var mb_lab = require('./routes/mb_lab')
var certificate = require("./routes/certificate");
var mb_academic = require("./routes/mb_academic");

var cors = require("cors");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(cors());

// เนื่องจากติด cors จึงต้องติดตั้งเพื่ออนุญาติ ip นี้
// var corsOptions = {
//   origin: [
//     "https://mb.mahidol.ac.th",
//     "http://localhost:3200",
//     "http://localhost:3300",
//     "http://10.20.5.205:3200",
//     "http://10.20.5.205:9200",
//   ],
// };

// var whitelist = [
//   "https://mb.mahidol.ac.th",
//   // "https://mb.mahidol.ac.th/seapi",
//   // "https://mb.mahidol.ac.th/mb_certificate",
//   // "https://mb.mahidol.ac.th/mb_certificate/certificate-edit",
//   // "https://mb.mahidol.ac.th/mb_certificate/show-pdf",
//   "http://10.62.36.51:3300",
//   "http://10.62.36.51:3200",
//   "http://10.20.5.205:3300",
//   "http://10.20.5.205:9200",
//   "http://localhost:3200",
//   "http://localhost:3300",
// ];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       //add || !origin for test REST API for server-to-server requests like Postman.
//       callback(null, true);
//     } else {
//       callback("Not allowed"); //Response
//     }
//   },
// };

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ให้ไปที่ api ตัวไหน
app.use("/", certificate);
app.use("/mb_policy", mb_policy);
app.use("/mb_lab", mb_lab);
app.use("/users", usersRouter);
app.use("/mb_academic", mb_academic);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(9200, () => {
  console.log("backend run port number 9200");
});

module.exports = app;
