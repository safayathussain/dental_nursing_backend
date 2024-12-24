const nodemailer = require('nodemailer');

async function sendEmail(to, subject, htmlContent) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}
module.exports = {sendEmail}