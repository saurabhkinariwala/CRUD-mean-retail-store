var nodemailer = require('nodemailer');
var gmail = require('../config/mail_config.js');

function EmailClass(receiverId) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: gmail.user,
            clientId: gmail.clientId,
            clientSecret: gmail.clientSecret,
            refreshToken: gmail.refreshToken,
            accessToken: gmail.accessToken
        }
        
      });

      var mailOptions = {
        from: 'Saurabh Kinariwala <saurabhkinariwala@gmail.com>',
        to: receiverId,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };

      this.sendEmail = function() {
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
      }
}

module.exports = EmailClass;



// EmailClass.prototype.sendEmail= function(receiverId) {
//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             type: 'OAuth2',
//             user: gmail.user,
//             clientId: gmail.clientId,
//             clientSecret: gmail.clientSecret,
//             refreshToken: gmail.refreshToken,
//             accessToken: gmail.accessToken
//         }
        
//       });
    
      
//     var mailOptions = {
//         from: 'Saurabh Kinariwala <saurabhkinariwala@gmail.com>',
//         to: receiverId,
//         subject: 'Sending Email using Node.js',
//         text: 'That was easy!'
//       };
//       transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });
     
// };
 