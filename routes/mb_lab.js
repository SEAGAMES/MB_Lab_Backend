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

  let sql = 'INSERT INTO book_lab set  ac_name=?, name=?, num_in_team=?, phone=?, where_lab=?, start_date=?, endtime=?'
  db.execute(sql, [ac_name, name, num_in_team, phone, where_lab, start_date, endtime], (err, result) => {
    if (err) {
      console.log(err + "bookLabRoom")
      req.msg = 'err'
    }
    else {
      req.msg = 'ok'
    }
  })

})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
}

authorize().then(listEvents).catch(console.error);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function addEventToCalendar() {
  const auth = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: 'https://www.googleapis.com/auth/calendar', // Use the correct scope
  });

  const calendar = google.calendar({ version: 'v3', auth });

  // Define the event details
  const event = {
    summary: 'Sample Event', // Event summary (title)
    description: 'This is a sample event description.', // Event description
    start: {
      dateTime: '2023-10-02T10:00:00', // Start date and time in ISO 8601 format
      timeZone: 'UTC', // Time zone for the start time
    },
    end: {
      dateTime: '2023-10-03T12:00:00', // End date and time in ISO 8601 format
      timeZone: 'UTC', // Time zone for the end time
    },
  };

  // Insert the event into the primary calendar
  const response = await calendar.events.insert({
    calendarId: 'primary', // Use the desired calendar ID
    resource: event,
  });

  console.log('Event created:', response.data.htmlLink);
}

addEventToCalendar().catch(console.error);

module.exports = router;

