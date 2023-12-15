const sendEmail = (html_body,to) => {
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
        from: '"ระบบแจ้งซ่อม mail" <mbwww@mahidol.ac.th>', //from email (option)
        to: to, //to email (require)
        
       
        subject: 'ระบบแจ้งซ่อม', //subject
        html: html_body //email body like `<p>Test</p>`
     }

     smtpTransport.sendMail(mail, function(error, response){
        smtpTransport.close();
        if(error){
           //error handler
           console.log(error)
           return false
        }else{
           //success handler 
           console.log('send email success');
         //   console.log(response)
           return true;
        }
     });
}

module.exports = {sendEmail: sendEmail}