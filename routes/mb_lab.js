const express = require('express');

const app = express();







app.post('/mbroom_send_form', mbroom_send_form, (req, res) => {
    res.json({ msg: req.msg, payload: req.data })
})