import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_USER,   
    pass: process.env.BREVO_SMTP_PASS,  
  },
});

await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: "user@example.com",
  subject: "Verify your email",
  html: `<p>Click here to verify your email</p>`,
});
