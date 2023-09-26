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

  //addEventToCalendar(name, start_date, endtime).catch(console.error);

  // let sql = 'INSERT INTO book_lab set  ac_name=?, name=?, num_in_team=?, phone=?, where_lab=?, start_date=?, endtime=?'
  // db.execute(sql, [ac_name, name, num_in_team, phone, where_lab, start_date, endtime], (err, result) => {
  //   if (err) {
  //     console.log(err + "bookLabRoom")
  //     req.msg = 'err'
  //   }
  //   else {
  //     req.msg = 'ok'
  //   }
  // })

})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const path = require('path');
const { google } = require('googleapis');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


function dateFormat(date) {
  const dateTimeString = date; // วันที่และเวลาในรูปแบบ ISO 8601
  const dateTime = new Date(dateTimeString); // แปลงเป็นวัตถุ Date
  const day = dateTime.getDate().toString().padStart(2, '0'); // วัน
  const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // เดือน (เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0)
  const year = dateTime.getFullYear(); // ปี
  const formattedDate = `${day}-${month}-${year + 543}`;
  return formattedDate
}

function formatTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const hours = dateTime.getHours().toString().padStart(2, '0');
  const minutes = dateTime.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

async function addEventToCalendar(name, startdate, enddate) {
  const auth = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: 'https://www.googleapis.com/auth/calendar', // Use the correct scope
  });

  const calendar = google.calendar({ version: 'v3', auth });
  const end = new Date(enddate);
  const start = startdate.split("T")[0]; // ดึงเอาเวลาออก 
  end.setDate(end.getDate() + 1); // เพิ่ม 1 วันใน end


  const event = {
    summary: `${name}`,
    description: `${formatTime(startdate)} - ${formatTime(enddate)}`,
    start: {
      date: start
    },
    end: {
      date: end.toISOString().split('T')[0], // ใช้ endDate ที่แก้ไขแล้ว
    },
    colorId: '3', // ตั้งค่ารหัสสีให้กับกิจกรรม
  };

  // Insert the event into the primary calendar
  const response = await calendar.events.insert({
    calendarId: '931dbff60b1127558b856ee6cbae877e4d2614d82d7c51a9c217a16b04bd4ed6@group.calendar.google.com', // Use the desired calendar ID
    resource: event,
  });

  //console.log('Event created:', response.data.htmlLink);
}

addEventToCalendar('B205 TEST', '2023-09-27T23:00:00', '2023-09-29T08:00:00').catch(console.error);


module.exports = router;

