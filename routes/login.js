const fs = require("fs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const SECRET = fs.readFileSync(__dirname + "/../config/key.key");
const { usermb } = require("./database");
const { ntp } = require("../config/ntp_name");

const express = require("express");
var app = express.Router();

app.get("/test", function (req, res, next) {
  //res.json({ msg: "success" });
  //sql = `SELECT token FROM user WHERE accountname = ?`;
  usermb
    .execute(`SELECT token FROM user`)
    .then(([data, fields]) => {
      //res.json({ data });
      if (data.length > 0) {
        res.json({ data });
      } else {
        res.json({ msg: "not found" }); 
      }
    })
    .catch((error) => {
      res.json({ msg: error });
    });
});

app.get("/user_data", function (req, res, next) {
  usermb
    .execute(`SELECT * FROM user`)
    .then(([data, fields]) => {
      //res.json({ data });
      if (data.length > 0) {
        res.json({ data });
      } else {
        res.json({ msg: "not found" });
      }
    })
    .catch((error) => {
      res.json({ msg: error });
    });
});

const loginMiddleWare = (req, res, next) => {
  const mu_token = req.body;

  // axios.post("https://mb.mahidol.ac.th/mb/enter/verify", { c: mu_token.c }).then(res => {
  // axios.post("http://localhost:3000/verify", { c: mu_token.c }).then(res => {
  axios.post("http://localhost:3000/verify", { c: mu_token.c }).then((res) => {
    if (res.status === 200) {
      console.log("res.data : ", res.data);
      const res_data = res.data;

      if (res_data.msg === "ok") {
        // let user = res_data.payload.accountname
        let email = res_data.payload.email.split("@");
        let sql = "";
        // console.log(user);

        console.log("email : ", email);

        if (email[1] == "dev.mahidol.ac.th" || email[1] == "mahidol.ac.th") {
          console.log("เย่");
          sql = `SELECT token FROM user WHERE accountname = ?`;
        } else {
          console.log("โย่");
          sql = `SELECT token FROM student WHERE accountname = ?`;
        }
        email[1] = "thanakrit.nim"; //อย่าลืมด้วย
        // sql = `SELECT token FROM student WHERE accountname = ?`
        // usermb.execute(sql, [email[0]], (err, result) => {
        //   if (err) {
        //     console.log(err + "พังที่ excute login 33");
        //     req.msg = "พังที่ excute login";
        //     next();
        //   } else {
        //     //console.log(result)
        //     if (result.length === 0) {
        //       console.log("ไม่พบรายชื่อ");
        //       req.msg = "ไม่พบรายชื่อในฐานข้อมูล โปรดติดต่อฝ่าย IT-MB";

        //       next();
        //     } else {
        //       req.userDetail = JSON.parse(JSON.stringify(result[0]));
        //       console.log(req.userDetail);
        //       req.msg = "ok";
        //       next();
        //     }
        //   }
        // });

        usermb
          .execute(`SELECT token FROM user WHERE accountname = '${email[1]}'`)
          .then(([result, fields]) => {
            console.log(result);
            if (result.length === 0) {
              console.log("ไม่พบรายชื่อ");
              req.msg = "ไม่พบรายชื่อในฐานข้อมูล โปรดติดต่อฝ่าย IT-MB";

              next();
            } else {
              req.userDetail = JSON.parse(JSON.stringify(result[0]));
              console.log("req.userDetail : ", req.userDetail);
              req.msg = "ok";
              next();
            }
          })
          .catch((error) => {
            console.log(error + "พังที่ excute login 33");
            req.msg = "พังที่ excute login";
            next();
          });
      } else {
        req.msg = "พบปัญหาที่ login-vty is not ok";
        console.log(
          "พบปัญหาที่ login-vty is not ok from backend " + res_data.msg
        );
        next();
      }
    } else {
      console.log("login res is not 200->  " + res.status);
      req.msg = "login res is not 200";
      next();
    }
  });
};
app.post("/login", loginMiddleWare, (req, res) => {
  if (req.msg === "ok") {
    console.log("/login");
    const payload = { token: req.userDetail["token"] };
    var token = jwt.sign(payload, SECRET, {
      expiresIn: "30d",
      algorithm: "HS512",
    });
    console.log(req.msg, token);
    res.json({ msg: req.msg, token: token });
  } else {
    console.log("พังที่ 81 /login " + req.msg);
    res.json({ msg: req.msg });
  }
});

const checktoken = (req, res, next) => {
  jwt.verify(req.get("Authorization"), SECRET, function (err, decoded) {
    if (err) {
      console.log(err);
      req.msg = "wrong-token_" + err.message;
      next();
    } else {
      req.msg = "token-ok";
      next();
    }
  });
};

app.post("/checktoken", checktoken, (req, res) => {
  res.json({ msg: req.msg });
});

const profilemiddleware = (req, res, next) => {
  console.log("มาล่าสุด");
  jwt.verify(req.get("Authorization"), SECRET, async function (err, decoded) {
    if (err) {
      next();
    } else {
      console.log("ล่าสุด 1.1");
      let time_stamp = await ntp();
      console.log("time_stamp : ", time_stamp);
      console.log("decoded.token : ", decoded.token);
      let sql = "";
      if (decoded.token.length == 32) {
        console.log("decoded.token.length == 32");
        sql = `SELECT * FROM student WHERE token = '${decoded.token}'`;
      } else {
        console.log("decoded.token.length != 32");
        sql = `SELECT CONCAT(title_thai,'',fname_thai,' ',sname_thai) AS thainame ,CONCAT(title_eng,fname_eng,' ',sname_eng)AS englishname,accountname,start_date,email,role,team,office,job_thai,job_eng,type from user INNER JOIN joblist ON user.joblist = joblist.joblist_id  WHERE token = '${decoded.token}'`;
        //"SELECT CONCAT(`title_thai`,'',`fname_thai`,' ',`sname_thai`) AS thainame ,CONCAT(`title_eng`,`fname_eng`,' ',`sname_eng`)AS englishname,`accountname`,`start_date`,`email`,`role`,`team`,`office`,`job_thai`,`job_eng`,type from user INNER JOIN joblist ON user.joblist = joblist.joblist_id  WHERE `token` = ?";
        //sql = `SELECT CONCAT(title_thai,'',fname_thai,' ',sname_thai) AS thainame ,CONCAT(title_eng,fname_eng,' ',sname_eng)AS englishname,accountname,start_date,email,role,team,office,job_thai,job_eng,type from user INNER JOIN joblist ON user.joblist = joblist.joblist_id  WHERE token = '${decoded.token}'`;
      }

      //   usermb
      // .execute(`SELECT * FROM user`)
      // .then(([data, fields]) => {

      // usermb.execute(sql, (err, result) => {
      //   if (err) {
      //     console.error("profilemiddleware at " + err);
      //     next();
      //   } else {
      //     console.log("OK");
      //     req.userDetail = JSON.parse(JSON.stringify(result[0]));
      //     req.userDetail.current_time = time_stamp;
      //     console.log(req.userDetail);
      //     req.msg = "ok";
      //     next();
      //   }
      // });

      usermb
        .execute(sql)
        .then(([result, fields]) => {
          console.log(result);
          if (result) {
            req.userDetail = JSON.parse(JSON.stringify(result[0]));
            req.userDetail.current_time = time_stamp;
            console.log(req.userDetail);
            req.msg = "ok";
            next();
          }
        })
        .catch((error) => {
          console.error("profilemiddleware at " + err);
          next();
        });
    }
  });
};

app.get("/profile", profilemiddleware, (req, res) => {
  res.json({ msg: req.msg, payload: req.userDetail, what: "who are you" });
});

module.exports = app;
