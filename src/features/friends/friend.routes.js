import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { userController } from "../users/user.controller.js";

export const friendRoutes = Router();

const controller = new userController();

friendRoutes.get("/get-friends/:userID", authenticateUser, (req, res, next) => {
  controller.getUserFriends(req, res, next);
});
friendRoutes.get("/get-pending-friends", authenticateUser, (req, res, next) => {
  controller.getPendingRequests(req, res, next);
});
friendRoutes.post(
  "/toggle-friendship/:friendID",
  authenticateUser,
  (req, res, next) => {
    controller.toggleFriend(req, res, next);
  }
);
friendRoutes.post(
  "/response-to-request/:friendID",
  authenticateUser,
  (req, res, next) => {
    controller.acceptOrRejectRequest(req, res, next);
  }
);
