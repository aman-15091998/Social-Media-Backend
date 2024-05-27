import { Router } from "express";
import { userController } from "./user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { upload } from "../../config/multer.config.js";
export const userRoutes = Router();
const controller = new userController();

userRoutes.post("/signup", (req, res, next) => {
  controller.signUp(req, res, next);
});
userRoutes.post("/signin", (req, res, next) => {
  controller.signIn(req, res, next);
});
userRoutes.get("/logout", authenticateUser, (req, res, next) => {
  controller.logout(req, res, next);
});
userRoutes.get("/logout-all-devices", authenticateUser, (req, res, next) => {
  controller.logoutAll(req, res, next);
});

// user profile routes
userRoutes.get("/get-details/:userID", authenticateUser, (req, res, next) => {
  controller.getUserDetailsWithoutPassword(req, res, next);
});
userRoutes.get("/get-all-details", authenticateUser, (req, res, next) => {
  controller.getAllUserDetailsWithoutPassword(req, res, next);
});
userRoutes.post(
  "/update-details/:userID",
  authenticateUser,
  upload.single("file"),
  (req, res, next) => {
    controller.updateUserDetails(req, res, next);
  }
);
