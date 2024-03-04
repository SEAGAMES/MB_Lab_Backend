var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var mb_policy = require("./routes/mb_policy");
var mb_lab = require("./routes/mb_lab");
var certificate = require("./routes/certificate");
var mb_academic = require("./routes/mb_academic");
var line_bot = require("./routes/line_bot");

var cors = require("cors");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(cors());

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
app.use("/line_bot", line_bot);

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

///////////////////////////////////////////////////////////// Line Bot ///////////////////////////////////////////////////////////////////////
// const line = require("@line/bot-sdk");
// const axios = require("axios").default;
// const dotenv = require("dotenv");

// const env = dotenv.config().parsed;

// const lineConfig = {
//   channelAcessToken: env.ACCESS_TOKEN,
//   channelSecret: env.SECRET_TOKEN,
// };

// app.post("/webhook", line.middleware(lineConfig), async (req, res) => {
//   try {
//     const events = req.body.events;
//     console.log("event=>>>>", events);
//     return events.length > 0
//       ? await events.map((item) => handleEvent(item))
//       : res.status(200);
//   } catch (error) {
//     res.status(500).end();
//   }

//   const handleEvent = async (event) => {
//     console.log(event);
//   };
// });

app.listen(9200, () => {
  console.log("backend run port number 9200");
});

module.exports = app;
