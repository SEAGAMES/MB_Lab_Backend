const express = require("express");
var router = express.Router();
const db = require("./database");

router.get("/mb_lab_room", function (req, res, next) {
  // res.render('index', { title: 'Express' });
  db.execute(`SELECT * FROM mb_room`)
    .then(([data, fields]) => {
      res.json({ data });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/bookLabRoom", (req, res) => {
  return new Promise((resolve) => {
    const {
      ac_name,
      name,
      phone,
      zone,
      floor,
      where_lab,
      start_date,
      endtime,
      timebook,
      appove_status,
      appove_ac_name,
    } = req.body;
    console.log(
      ac_name,
      name,
      phone,
      zone,
      floor,
      where_lab,
      start_date,
      endtime,
      timebook,
      appove_status,
      appove_ac_name
    );
    let sql =
      "INSERT INTO from SET id=?, ac-name=?, name=?, num_in_team=?, phone=?, where_lab=?, start_date=?, endtime=?, timebook=?";
    db.execute(sql, [
      ac_name,
      name,
      phone,
      where_lab,
      start_date,
      endtime,
      timebook,
    ]),
      (err, result) => {
        if (err) {
          console.log(err + " at bookLabRoom");

          resolve(err + " at bookLabRoom");
        } else {
          resolve("ok");
        }
      };
  });
});

// function bookLabRoom(data) {
//   return new Promise((resolve) => {
//     let sql = 'INSERT INTO `book_lab`(`id`, `ac-name`, `name`, `num_in_team`, `phone`, `where_lab`, `start_date`, `endtime`, `timebook`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]','[value-9]')'
//   })
// }

module.exports = router;

// app.post('/mbroom_send_form', mbroom_send_form, (req, res) => {
//     res.json({ msg: req.msg, payload: req.data })
// })
