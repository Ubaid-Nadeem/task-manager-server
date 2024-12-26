import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ubaidmuhammad916@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function mailVerification(name, email, link) {
  
    let mailOptions = {
    from: "ubaidmuhammad916@gmail.com",
    to: `${email}`,
    subject: "Verification Email",
    text: `Task Manager \n \n Hello, ${name} \n \n \n \n CLick the link to be given below, Thank you! \n \n ${link}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

