const nodemailer = require("nodemailer");

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email app password
  },
});

// Function to send email notifications
async function sendEmailNotification(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender's email
      to, // Recipient's email
      subject, // Email subject
      text, // Email body
    });
    console.log(`Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}



module.exports = { sendEmailNotification };
