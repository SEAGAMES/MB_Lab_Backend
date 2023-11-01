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
    res.json({ msg: 'ok' });
  })
    .catch((error) => {
      res.json({ msg: 'error' });
    });
})

router.get("/data_certificate", function (req, res, next) {
  mb_certificate.execute(`SELECT * FROM certificate_master ORDER BY id`)
    .then(([data, fields]) => {
      res.json({ data });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/data_filter/:pj_code", function (req, res, next) {
  const { pj_code } = req.params
  console.log(pj_code)
  mb_certificate.execute(`SELECT * FROM certificate_master WHERE pj_code LIKE '%${pj_code}%'`)
    .then(([data, fields]) => {
      res.json({ data });
    })
    .catch((error) => {
      res.json({ msg: 'error' });
    });
});

router.get("/data_detail", function (req, res, next) {
  mb_certificate.execute(`SELECT * FROM certificate_detail`)
    .then(([data, fields]) => {
      console.log(data)
      res.json({ data });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/data_duplicate/:pj_code", function (req, res, next) {
  const { pj_code } = req.params
  mb_certificate.execute(`SELECT * FROM certificate_master WHERE pj_code = '${pj_code}'`)
    .then(([data, fields]) => {
      if (data.length > 0) {
        res.json({ msg: 'error' });
      } else {
        res.json({ msg: 'ok' });
      }
    })
    .catch((error) => {
      res.json({ msg: 'error' });
    });
});

router.delete("/delete_certificate/:pj_code", async (req, res, next) => {
  const { pj_code } = req.params;
  // ลบ certificate_master
  await mb_certificate.execute("DELETE FROM certificate_master WHERE pj_code = ?", [pj_code]).then(async () => {
    // ลบ certificate_detail
    await mb_certificate.execute("DELETE FROM certificate_detail WHERE pj_code = ?", [pj_code]).then(() => {
      res.json({ msg: 'ok' });
    })
  })
    .catch((error) => {
      res.json({ msg: 'error' });
    });

  // try {
  //   // ใช้คำสั่ง SQL DELETE เพื่อลบแถวที่ตรงกับ pj_code
  //   const [result] = await mb_certificate.execute("DELETE FROM certificate_master WHERE pj_code = ?", [pj_code]);

  //   if (result.affectedRows > 0) {
  //     // ถ้ามีแถวถูกลบ จะส่งข้อความ 'ok' กลับ
  //     res.json({ msg: 'ok' });
  //   } else {
  //     // ถ้าไม่มีแถวถูกลบ (pj_code ไม่ตรง) จะส่งข้อความ 'error' กลับ
  //     res.json({ msg: 'error' });
  //   }
  // } catch (error) {
  //   // หากเกิดข้อผิดพลาดในการเรียกฐานข้อมูล
  //   res.status(500).json({ msg: 'error' });
  // }
});


module.exports = router;