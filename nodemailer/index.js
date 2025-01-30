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
    html: `<div> 
     <h1> Task Manager </h1> 
     <h2> Hello, ${name} </h2>
     <p> CLick the link to be given below, Thank you!</p>
     <a  href=${link}>Verify your email </a>
     </div>  `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
