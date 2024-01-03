var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var mb_lab = require('./routes/mb_lab')
var certificate = require("./routes/certificate");
var login = require("./routes/login");

var cors = require("cors");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(cors());

var whitelist = [
  "https://mb.mahidol.ac.th",
  "https://mb.mahidol.ac.th/seapi",
  "http://10.62.32.14:3200",
  "http://10.62.32.14:3300",
  "http://10.20.5.205:9200",
  "http://localhost:3200",
  "http://localhost:3300",
  "http://localhost:8080",

];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      //add || !origin for test REST API for server-to-server requests like Postman.
      callback(null, true);
    } else {
      callback("Not allowed"); //Response
    }
  },
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ให้ไปที่ api ตัวไหน
app.use("/", certificate);
app.use("/login", login);
app.use("/mb_lab", mb_lab);
app.use("/users", usersRouter);

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
