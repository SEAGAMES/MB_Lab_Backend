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
    room_code
  } = req.body;

  console.log(req.body)

  // แปลงข้อมูล start_date และ endtime เป็นวัตถุ Date
  const startDate = new Date(start_date);
  const endDate = new Date(endtime);

  // เพิ่ม 7 ชั่วโมงในวันที่และเวลา
  startDate.setHours(startDate.getHours() + 7);
  endDate.setHours(endDate.getHours() + 7);

  // แปลงกลับเป็นสตริงในรูปแบบ ISO 8601 เเละ ลบ 2 ตัวหลังออก
  const newStartDate = startDate.toISOString().slice(0, -5);
  const newEndDate = endDate.toISOString().slice(0, -5);

  console.log()

  // const ac_name = 'thanakrit.nim'
  // const name = 'Thanakrit Nimnual'
  // const num_in_team = 5
  // const phone = '0621699636'
  // const zone = 'B'
  // const floor = '2'
  // const where_lab = 'B205'
  // const start_date = '2023-09-27T16:00:00.841Z'
  // const endtime = '2023-09-28T01:00:00.841Z'
  // const appove_status = 'true'
  // const ppove_ac_name = 'thanakrit.nim'

  db.execute(`SELECT * FROM book_lab WHERE where_lab = '${where_lab}' AND start_date BETWEEN '${newStartDate}' AND '${newEndDate}'`)
    .then(([data, fields]) => {
      if (data.length === 0) {
        addEventToCalendar(name, start_date, endtime, room_code).catch(console.error);
        let sql = 'INSERT INTO book_lab SET ac_name=?, name=?, num_in_team=?, phone=?, where_lab=?, start_date=?, endtime=?';
        db.execute(sql, [ac_name, name, num_in_team, phone, where_lab, newStartDate, newEndDate], (err, result) => {
          if (err) {
            console.log(err + "bookLabRoom");
            req.msg = 'err';
          } else {s
            req.msg = 'ok';
          }
        });
      } else {
        res.status(400).json({ msg: 'Time conflict' });
      }
    })
    .catch((error) => {
      console.log(error);
    });
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

async function addEventToCalendar(name, startdate, enddate, room_code) {
  //console.log(startdate, enddate)
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
    calendarId: room_code, // Use the desired calendar ID
    resource: event,
  });

  //console.log('Event created:', response.data.htmlLink);
}

//addEventToCalendar('B205 TEST', '2023-09-27T23:00:00', '2023-09-29T08:00:00').catch(console.error);


module.exports = router;

