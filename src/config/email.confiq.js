import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "amantbitw@gmail.com",
    pass: "gtwckywaxaqlreuo", //I will be removing the access after uploading the assignment
  },
});

export function sendOTPonEmail(OTP, userEmail) {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: userEmail,
    subject: "Reset your Password",
    text: `Your One Time Password in ${OTP}. Do not share this OTP with anyone.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}
