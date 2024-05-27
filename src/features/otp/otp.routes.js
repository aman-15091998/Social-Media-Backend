import { Router } from "express";
import { resetPassword, sendOTP, verifyOTP } from "./otp.controller.js";

export const otpRoutes = Router();

otpRoutes.post("/send", (req, res, next) => {
  sendOTP(req, res, next);
});
otpRoutes.post("/verify", (req, res, next) => {
  verifyOTP(req, res, next);
});
otpRoutes.post("/reset-password", (req, res, next) => {
  resetPassword(req, res, next);
});
