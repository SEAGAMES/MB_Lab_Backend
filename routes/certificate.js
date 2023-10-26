const express = require("express");
var router = express.Router();
const { mb_certificate } = require("./database");

router.post("/create_certificate", async (req, res) => {
  const {
    pj_code, pj_name, language, currentYear, date_desc, add_name, add_position, sign, two_sign
  } = req.body[0];

  const sql = 'INSERT INTO certificate_master SET pj_code=?, language=?, pj_name=?, currentYear=?, date_desc=?, add_name=?, add_position=?, sign=?, two_sign=?';
  await mb_certificate.execute(sql, [pj_code, language, pj_name, currentYear, date_desc, add_name, add_position, sign, two_sign]).then(([data, fields]) => {
    const details = req.body[1];

    // loop ขอว certificate Detail
    for (const [index, obj] of details.entries()) {
      const sql2 = 'INSERT INTO certificate_detail SET pj_code=?, no=?, prefix=?, name=?';
      mb_certificate.execute(sql2, [pj_code, index + 1, obj.prefix, obj.name]);
    }
    console.log('PASS PASS PASS')
    res.json({ data });
  })
    .catch((error) => {
      console.log('ERROR ERROR ERROR');
    });


  // if (results.affectedRows === 1) {
  //   const details = req.body[1];

  //   // loop ขอว certificate Detail
  //   for (const [index, obj] of details.entries()) {
  //     const sql2 = 'INSERT INTO certificate_detail SET pj_code=?, no=?, prefix=?, name=?';
  //     await mb_certificate.execute(sql2, [pj_code, index + 1, obj.prefix, obj.name]);
  //   }
  //   res.json({ msg: 'ok' });
  // } else {
  //   console.log(' ERROR ERROR ERROR ')
  //   res.json({ msg: 'error' });
  // }
})

router.get("/data_certificate", function (req, res, next) {
  mb_certificate.execute(`SELECT * FROM certificate_master`)
    .then(([data, fields]) => {
      res.json({ data });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;