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
  const {
    ac_name,
    name,
    num_in_team,
    phone,
    zone,
    floor,
    where_lab,
    start_date,
    endtime,
    appove_status,
    appove_ac_name,
  } = req.body;

  console.log(ac_name,
    name,
    num_in_team,
    phone,
    zone,
    floor,
    where_lab,
    start_date,
    endtime,
    appove_status,
    appove_ac_name,)

  let sql = 'INSERT INTO book_lab set  ac_name=?, name=?, num_in_team=?, phone=?, where_lab=?, start_date=?, endtime=?'
  db.execute(sql, [ac_name, name, num_in_team, phone, where_lab, start_date, endtime], (err, result) => {
    if (err) {
      console.log(err + "bookLabRoom")
      req.msg = 'err'
    }
    else {
      req.msg = 'ok'
    }
  })

})

module.exports = router;

