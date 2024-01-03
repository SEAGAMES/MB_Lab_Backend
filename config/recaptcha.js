const { default: axios } = require('axios');
const captcha_code = '6LevXi4nAAAAAEykKVKA-n3Zg1dyPv4TSJy-C4w2'


const myrecaptcha = async (captcha) => {

    return axios.post('https://www.google.com/recaptcha/api/siteverify?secret=' + captcha_code + '&response=' + captcha)
        .then(res => {
            if (!res.data.success || res.data.score < 0.7) {

                console.log(res.data);
                console.error("You might be a robot, sorry");
                return false

            }
            else {
                // console.log(res.data);
                return true
            }
        })
}
module.exports = { recaptcha: myrecaptcha }

