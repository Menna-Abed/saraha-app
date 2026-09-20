// create transporter
import nodemailer from "nodemailer";


const transporter  = nodemailer.createTransport({
     host: "smtp.gmail.com",
     port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_User,
        pass: process.env.MAIL_PASS
    }
});


export async function sendEmail(to,subject,html)  {


    await transporter.sendMail({
        from: '"NGL-APP" <${process.env.MAIL_User}> ',
        to: to,
        subject: subject,
        html: html
    });}

