const express = require("express");
var router = express.Router();

const line = require("@line/bot-sdk");
const axios = require("axios").default;
const dotenv = require("dotenv");

const env = dotenv.config().parsed;

const lineConfig = {
  channelAcessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN,
};

//const client = new line.Client(lineConfig);

router.post("/webhook", line.middleware(lineConfig), async (req, res) => {
  console.log(lineConfig);
  try {
    const events = req.body.events;
    console.log("event=>>>>", events);
    return events.length > 0
      ? await events.map((item) => handleEvent(item))
      : res.status(200).send('OK');
  } catch (error) {
    res.status(500).end();
  }

  const handleEvent = async (event) => {
    console.log(event);
    //return client.replyMessage(event.replyToken,{type:'text', text:'Test'})
  };
});

module.exports = router;
