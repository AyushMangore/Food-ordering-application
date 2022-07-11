"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper

module.exports.sendMail = async function sendMail(str, data) {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "ayushmangore9424653465@gmail.com", // generated ethereal user
                pass: "cpttzxifceqdtbsc", // generated ethereal password
            },
        });

        var Osubject, Otext, Ohtml;
        if (str == 'signup') {
            Osubject = `Thank you for signing up ${data.name}`
            Ohtml = `
              <h1>Welcome to foodApp.com</h1>
              Hope you have a good time !
              Here are your details : 
              Name : ${data.name}
              Email : ${data.email} 
              `
        } else if (str == "resetpassword") {
            Osubject = `Reset Password`
            Ohtml = `
            <h1>foodApp.com</h1>
            Here is the link to reset the password : 
            ${data.resetPasswordLink}
            `
        }

        let info = await transporter.sendMail({
            from: '"FoodApp 🥘" ayushmangore9424653465@gmail.com', // sender address
            to: data.email, // list of receivers
            subject: Osubject, // Subject line
            // text: "Hello world?", // plain text body
            html: Ohtml, // html body
        });
        console.log("Message send %s", info.messageId);

    }
    catch (err) {
        console.log(err.message);
    }
}


