const express = require("express");
var router = express.Router();
const { mb_lab } = require("./database");
const { sendEmail } = require('../email/email')

// เเปลงรูปแบบเวลาสำหรับเเสดงใน email
const formatdate = async (date) => {
  const isoDate = date;
  const dateObject = new Date(isoDate);

  // สร้างรายการของชื่อวันในภาษาไทย
  const thaiDays = [
    "(อา.)",
    "(จ.)",
    "(อ.)",
    "(พ.)",
    "(พฤ.)",
    "(ศ.)",
    "(ส.)",
  ];

  // ดึงชื่อวันโดยใช้ getDay() เพื่อหาว่าวันที่ในสัปดาห์เป็นวันอะไร
  const dayName = thaiDays[dateObject.getDay()];

  // สร้างรูปแบบในการแสดงผล
  const timeString = dateObject.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour24: true, // เปลี่ยนเป็นรูปแบบ 12 ชั่วโมง AM/PM
  });

  const formattedDate = `${dayName} ${dateObject.getDate()}/${
    dateObject.getMonth() + 1
  }/${dateObject.getFullYear()} (${timeString})`;
  return formattedDate;
}

// ส่ง mail เเจ้งเตือนเเละเตรียมอนุมัติ
const mbroom_form_tomail = async (data, startDate_ShowMail, endDate_ShowMail) => {
  let to = "thanakrit.nim@mahidol.ac.th"
  // let to ="sujit.vat@mahidol.ac.th"
  let cc = ""
  let bcc = ""
  let subject = "ขอใช้ห้องปฏิบัติการในสถาบันฯ"
  let mail_body = '<div style="font-size: 18px;"> <p>เรียน รศ. ดร. อภินันท์ อุดมกิจ</p> <p>เนื่องด้วย ' + data.name + ' มีความประสงค์การให้ &nbsp;</p> <p>' + data.student_name + ' หลักสูตร ' + data.aca_value + ' </p> <p>ใช้ห้อง ' + data.where_lab + ' ตั้งเเต่ ' + startDate_ShowMail + ' - ' + endDate_ShowMail + '</p> <p>เหตุผลในการขอใช้ห้อง ' + data.reason + ' </p> <p>โปรดอนุญาติ&nbsp;<a data-fr-linked="true" href="http://10.62.116.67:3200/mb_lab/#/mb-approve">http://10.62.116.67:3200/mb_lab/#/mb-approve</a><br><br><br></p> </div>'
  sendEmail(mail_body, to, cc, bcc, subject)
}

router.get("/mb_lab_room", function (req, res, next) {
  // res.render('index', { title: 'Express' });
  mb_lab
    .execute(`SELECT * FROM mb_room`)
    .then(([data, fields]) => {
      res.json({ data });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/thisLabBooking/:labNo", function (req, res, next) {
  const { labNo } = req.params;
  mb_lab
    .execute(
      `
      SELECT * FROM book_lab
      WHERE where_lab ='${labNo}' AND start_date >= CURDATE()
      ORDER BY start_date ASC;
      `
    )
    .then(([data, fields]) => {
      //res.json({ data });
      if (data.length > 0) {
        // console.log("สำเร็จ");
        res.json({ data });
      } else {
        res.json({ msg: "not found" });
      }
    })
    .catch((error) => {
      res.json({ msg: error });
    });
}),
  router.get("/mb_booking_lab", function (req, res, next) {
    // res.render('index', { title: 'Express' });
    mb_lab
      .execute(
        `SELECT * FROM book_lab
        WHERE start_date >= CURDATE()
        ORDER BY appove_status ASC, start_date ASC;
        `
      )
      .then(([data, fields]) => {
        res.json({ data });
      })
      .catch((error) => {
        console.log(error);
      });
  });

router.post("/bookLabRoom", async (req, res) => {
  const { ac_name, name, student_name, aca_id, reason, where_lab, start_date, endtime } =
    req.body;

  //console.log(req.body);

  // แปลงข้อมูล start_date และ end_date เป็นวัตถุ Date
  const startDate = new Date(start_date);
  const endDate = new Date(endtime);

  // เพิ่ม 7 ชั่วโมงในวันที่และเวลา
  const startDate_Between = new Date(start_date);
  const endDate_Between = new Date(endtime);
  startDate_Between.setHours(startDate.getHours() + 7);
  endDate_Between.setHours(endDate.getHours() + 7);
  const newStartDate = formatISODate(startDate_Between);
  const newEndDate = formatISODate(endDate_Between);

  try {
    // เช็กเวลาว่าซ้ำมั้ย
    // const [data, fields] = await mb_lab.execute(
    //   `SELECT * FROM book_lab WHERE where_lab = '${where_lab}' AND ('${newStartDate}' BETWEEN start_date AND end_date OR '${newEndDate}' BETWEEN start_date AND end_date)`
    // );

    // if (data.length === 0) {
    //   //await addEventToCalendar(name, newStartDate, endDate, newEndDate, room_code);
    //   const sql =
    //     "INSERT INTO book_lab SET ac_name=?, name=?, aca_id=?, reason=?, where_lab=?, appove_status=?, start_date=?, end_date=?";
    //   const [results, _] = await mb_lab.execute(sql, [
    //     ac_name,
    //     name,
    //     aca_id	,
    //     reason,
    //     where_lab,
    //     "0",
    //     startDate,
    //     endDate,
    //   ]);
    //   //console.log('Insert ID:', results.insertId); // รับ ID ของข้อมูลที่ถูกเพิ่ม
    //   res.json({ msg: "ok" });
    // } else {
    //   console.log("Time conflict");
    //   res.json({ msg: "Time conflict" });
    // }

    const sql =
      "INSERT INTO book_lab SET ac_name=?, name=?, student_name=?, aca_id=?, reason=?, where_lab=?, appove_status=?, start_date=?, end_date=?";
    const [results, _] = await mb_lab.execute(sql, [
      ac_name,
      name,
      student_name,
      aca_id,
      reason,
      where_lab,
      "0",
      startDate,
      endDate,
    ]);
    const startDate_ShowMail = await formatdate(startDate);
    const endDate_ShowMail = await formatdate(endDate);

    mbroom_form_tomail(req.body, startDate_ShowMail, endDate_ShowMail)
    res.json({ msg: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post("/updateApproveStatus", async (req, res) => {
  const id = req.body.id; // รับค่า dataID จาก req.body
  const statusCode = req.body.statusCode; // รับค่า value จาก req.body
  const approver = req.body.approver

  try {
    // สร้างคำสั่ง SQL UPDATE สถานะการอนุมัติ
    const sql = `
      UPDATE book_lab
      SET appove_status = ?, appove_ac_name = ?
      WHERE id = ?
    `;

    // ทำการอัปเดตสถานะการอนุมัติในฐานข้อมูล
    const [results] = await mb_lab.execute(sql, [statusCode, approver, id]);
    //console.log(results)

    // ตรวจสอบผลลัพธ์และส่งคำตอบ JSON กลับไปยังฝั่ง frontend เพื่อรายงานสถานะของการอัปเดต (สำเร็จหรือไม่)
    if (results.affectedRows === 1) {
      res.json({ msg: "ok" });
    } else {
      res.json({ msg: "error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.delete("/delete_bookingLab/:id", async (req, res, next) => {
  const { id } = req.params;
  mb_lab
    .execute(`DELETE FROM book_lab WHERE id = ${id}`)
    .then(async () => {
      res.json({ msg: "ok" });
    })
    .catch((error) => {
      res.json({ msg: "error" });
    });
});

function formatISODate(isoString) {
  const isoDate = new Date(isoString);

  // สร้างฟังก์ชันเพื่อให้ค่าที่มีความสอดคล้องกับการแสดงผล
  const padZero = (value) => (value < 10 ? `0${value}` : value);

  // นำค่าวันที่และเวลามาจัดรูปแบบ
  const formattedDate = `${isoDate.getUTCFullYear()}-${padZero(
    isoDate.getUTCMonth() + 1
  )}-${padZero(isoDate.getUTCDate())} ${padZero(
    isoDate.getUTCHours()
  )}:${padZero(isoDate.getUTCMinutes())}:${padZero(isoDate.getUTCSeconds())}`;

  return formattedDate;
}

const isoString = "2023-12-26T14:43:00.717Z";
const formattedDate = formatISODate(isoString);
//console.log(formattedDate); // Output: '2023-12-26 14:43:00'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const path = require("path");
const { google } = require("googleapis");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

function formatTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const hours = dateTime.getHours().toString().padStart(2, "0");
  const minutes = dateTime.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

async function addEventToCalendar(
  name,
  startdate,
  enddate,
  newEndDate,
  room_code
) {
  //console.log(startdate, enddate)
  const auth = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: "https://www.googleapis.com/auth/calendar", // Use the correct scope
  });

  console.log(auth);

  const calendar = google.calendar({ version: "v3", auth });
  const end = new Date(enddate);
  const start = startdate.split("T")[0]; // ดึงเอาเวลาออก
  end.setDate(end.getDate() + 1); // เพิ่ม 1 วันใน end

  const event = {
    summary: `${name}`,
    description: `${formatTime(startdate)} - ${formatTime(newEndDate)}`,
    start: {
      date: start,
    },
    end: {
      date: end.toISOString().split("T")[0], // ใช้ endDate ที่แก้ไขแล้ว
    },
    colorId: "6", // ตั้งค่ารหัสสีให้กับกิจกรรม
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
