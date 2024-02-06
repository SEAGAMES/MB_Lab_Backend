const express = require("express");
var router = express.Router();
const { mb_policy } = require("./database");


router.get("/policy_approve", function (req, res, next) {
    mb_policy
      .execute(`SELECT * FROM policy_approve`)
      .then(([data, fields]) => {
        res.json({ data });
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // /* GET home page. */
router.get('/test', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({msg:'sss'})
  console.log('ssss')
});


  module.exports = router;