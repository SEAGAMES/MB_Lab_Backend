const NTP = require('ntp-time').Client;
// const client = new NTP('time.cloudflare.com', 123, { timeout: 2000 });
const client = new NTP('time.mahidol.ac.th', 123, { timeout: 2000 });

const time_ntp = async () => {
    let t = null
    await client.syncTime()

        .then(time => {

            t = time.time
        }) // time is the whole NTP packet

        .catch((err) => {
            console.log(err)
            t = new Date()
        });
    return new Date(t)

}

module.exports = { ntp: time_ntp }