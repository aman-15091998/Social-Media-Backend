import { sendOTPonEmail } from "../../config/email.confiq.js";
import { ApplicationError } from "../ErrorHandler.js";
import { usersModel } from "../users/user.repository.js";
import bcrypt from "bcrypt";
export function getOTP(min = 100000, max = 999999) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function sendOTP(req, res, next) {
  try {
    const { email } = req.body;
    const otp = getOTP();
    const user = await usersModel.findOne({ email });
    if (!user) throw new ApplicationError(400, "Invalid user");
    user.otp = otp;
    sendOTPonEmail(otp, user.email);

    await user.save();
    clearOTP(email, otp);
    res.status(201).send({
      success: true,
      message: "OTP is sent on your registered email",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}
export async function verifyOTP(req, res, next) {
  try {
    console.log(req.body);
    const { email, otp } = req.body;
    const user = await usersModel.findOne({ email, otp });
    if (!user) throw new ApplicationError(400, "Incorrect OTP");
    res
      .status(201)
      .send({ success: true, message: "OTP verification successful" });
  } catch (err) {
    console.log(err);
    next(err);
  }
}
export async function resetPassword(req, res, next) {
  try {
    const { email, newPassword, otp } = req.body;
    const user = await usersModel.findOne({ email: email, otp: otp });
    if (!user) throw new ApplicationError(400, "Unauthorized access");
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(newPassword, salt);
    await usersModel.findOneAndUpdate(
      { email: email, otp: otp },
      { $unset: { otp: 1 }, password: hashedPwd }
    );
    res
      .status(201)
      .send({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.log(err);
    next(err);
  }
}
export async function clearOTP(email, otp) {
  setTimeout(async () => {
    await usersModel.findOneAndUpdate(
      { email: email, otp: otp },
      { $unset: { otp: 1 } }
    );
  }, 60 * 1000);
}
