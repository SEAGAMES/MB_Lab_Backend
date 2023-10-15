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

router.get("/mb_booking_lab", function (req, res, next) {
  // res.render('index', { title: 'Express' });
  db.execute(`SELECT * FROM book_lab
  WHERE DATE(start_date) >= DATE(NOW() - INTERVAL 30 DAY)
  ORDER BY appove_status;
  `)
    .then(([data, fields]) => {
      res.json({ data });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/bookLabRoom", async (req, res) => {
  const {
    ac_name,
    name,
    num_in_team,
    phone,
    zone,
    floor,
    where_lab,
    start_date,
    end_date,
    appove_status,
    appove_ac_name,
    room_code
  } = req.body;

  console.log(req.body)

  // แปลงข้อมูล start_date และ end_date เป็นวัตถุ Date
  const startDate = new Date(start_date);
  const endDate = new Date(end_date); // ใช้ใส่ google calendar เนื่องจากต้องทำให้อยู่ในรูป 2023-09-28T18:00:00.110Z ในวันสุดท้าย ซึ่งจะทำให้ tab ของปฎิทินยาวออกไม่รวมอยู่วันเดียว

  // เพิ่ม 7 ชั่วโมงในวันที่และเวลา
  startDate.setHours(startDate.getHours() + 7);
  endDate.setHours(endDate.getHours() + 7);

  // แปลงกลับเป็นสตริงในรูปแบบ ISO 8601 เเละ ลบ 2 ตัวหลังออก
  const newStartDate = startDate.toISOString().slice(0, -5); // ใช้ลง DB และ ใส่ google calendar
  const newEndDate = endDate.toISOString().slice(0, -5); // ใช้ลง DB 

  try {
    const [data, fields] = await db.execute(`SELECT * FROM book_lab WHERE where_lab = '${where_lab}' AND start_date BETWEEN '${newStartDate}' AND '${newEndDate}'`);

    if (data.length === 0) {
      await addEventToCalendar(name, newStartDate, endDate, newEndDate, room_code);
      const sql = 'INSERT INTO book_lab SET ac_name=?, name=?, num_in_team=?, phone=?, where_lab=?, start_date=?, end_date=?';
      const [results, _] = await db.execute(sql, [ac_name, name, num_in_team, phone, where_lab, newStartDate, newEndDate]);
      //console.log('Insert ID:', results.insertId); // รับ ID ของข้อมูลที่ถูกเพิ่ม
      res.json({ msg: 'ok' });
    } else {
      res.json({ msg: 'Time conflict' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
})

router.post("/updateApproveStatus", async (req, res) => {
  const id = req.body.id; // รับค่า dataID จาก req.body
  const statusCode = req.body.statusCode; // รับค่า value จาก req.body

  try {
    // สร้างคำสั่ง SQL UPDATE สถานะการอนุมัติ
    const sql = `
      UPDATE book_lab
      SET appove_status = ?
      WHERE id = ?
    `;

    // ทำการอัปเดตสถานะการอนุมัติในฐานข้อมูล
    const [ results ] = await db.execute(sql, [statusCode, id]);
    //console.log(results)

    // ตรวจสอบผลลัพธ์และส่งคำตอบ JSON กลับไปยังฝั่ง frontend เพื่อรายงานสถานะของการอัปเดต (สำเร็จหรือไม่)
    if (results.affectedRows === 1) {
      res.json({ msg: 'ok' });
    } else {
      res.json({ msg: 'error' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


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

async function addEventToCalendar(name, startdate, enddate, newEndDate, room_code) {
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
    description: `${formatTime(startdate)} - ${formatTime(newEndDate)}`,
    start: {
      date: start
    },
    end: {
      date: end.toISOString().split('T')[0], // ใช้ endDate ที่แก้ไขแล้ว
    },
    colorId: '6', // ตั้งค่ารหัสสีให้กับกิจกรรม
  };

  // ใช้ตรวจว่าค่าได้ถูกส่งไปสำเร็จเเล้วหรือไม่
  const response = await calendar.events.insert({
    calendarId: room_code, // Use the desired calendar ID
    resource: event,
  });


  // เช็คสถานะการเรียก API ในคำตอบ
  if (response.status === 200) {
    // คำขอสำเร็จ
    // console.log('Event created successfully:', response.data.htmlLink);
  } else {
    // คำขอไม่สำเร็จ คุณสามารถดูข้อมูลเพิ่มเติมใน response.data เพื่อเข้าใจปัญหา
    // console.error('Failed to create event. Status code:', response.status);
    // console.error('Error data:', response.data);
  }


}


module.exports = router;