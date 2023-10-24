const express = require("express");
var router = express.Router();
const { mb_certificate } = require("./database");

router.post("/create_certificate", async (req, res) => {
    const {
        pj_code, pj_name, language, currentYear, date_desc, add_name, add_position, sign, two_sign
    } = req.body;

     console.log(req.body)

    const sql = 'INSERT INTO created_certificate SET pj_code=?, language=?, pj_name=?, currentYear=?, date_desc=?, add_name=?, add_position=?, sign=?, two_sign=?';
    const [results] = await mb_certificate.execute(sql, [pj_code, language, pj_name, currentYear, date_desc, add_name, add_position, sign, two_sign]);

    if (results.affectedRows === 1) {
        res.json({ msg: 'ok' });
    } else {
        res.json({ msg: 'error' });
    }
})

router.get('/test', async (req, res) => {
    res.json('eiei')
})
module.exports = router;