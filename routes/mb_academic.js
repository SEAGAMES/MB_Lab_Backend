const express = require("express");
var router = express.Router();
const { mb_academic } = require("./database");

router.get("/academic_programs", function (req, res, next) {
    // res.render('index', { title: 'Express' });
    mb_academic
      .execute(`SELECT * FROM academic_program`)
      .then(([data, fields]) => {
        res.json({ data });
      })
      .catch((error) => {
        console.log(error);
      });
  });


module.exports = router;