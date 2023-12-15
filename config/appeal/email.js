const sendEmail = (html_body, to ,subject) => {
    return new Promise((resolve, reject) => {
        const mailer = require("nodemailer");
        let smtp = {
            host: 'mumail.mahidol.ac.th', //set to your host name or ip
            port: 587, //25, 465, 587 depend on your 
            auth: {
                user: 'mbwww@mahidol.ac.th', //user account
                pass: 'mbwww2021' //user password
            }
        };
        let smtpTransport = mailer.createTransport(smtp);

        let mail = {
            from: '"ระบบแจ้งเมลสถาบันชีววิทยาศาสตร์โมเลกุล" <mbwww@mahidol.ac.th>', //from email (option)
            to: to, //to email (require)
            
           

            subject: subject, //subject
            html: html_body //email body like `<p>Test</p>`
        }

        smtpTransport.sendMail(mail, function (error, response) {
            smtpTransport.close();
            if (error) {
                //error handler
                console.log(error)
                resolve(false);
                return false
            } else {
                //success handler 
                
                //   console.log(response)
                resolve(true);
                console.log('send email success');
                return true;
                
            }
        });
    })


}

module.exports = { sendEmail: sendEmail }