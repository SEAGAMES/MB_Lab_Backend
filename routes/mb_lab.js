const express = require("express");
var router = express.Router();
const db = require('./database')


router.get("/mb_lab_room", function (req, res, next) {
  // res.render('index', { title: 'Express' });
  db.execute(`SELECT * FROM mb_room`)
  .then(([data, fields]) => {
    res.json({ data })
  })
  .catch((error) => {
    console.log(error);
  });
});

module.exports = router;

// app.post('/mbroom_send_form', mbroom_send_form, (req, res) => {
//     res.json({ msg: req.msg, payload: req.data })
// })
