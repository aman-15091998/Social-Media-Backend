import { Router } from "express";
import { commentController } from "./comment.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

export const commentRoutes = Router();
const controller = new commentController();

commentRoutes.get("/:postID", authenticateUser, (req, res, next) => {
  controller.getComments(req, res, next);
});
commentRoutes.post("/:postID", authenticateUser, (req, res, next) => {
  controller.postComment(req, res, next);
});
commentRoutes.delete("/:commentID", authenticateUser, (req, res, next) => {
  controller.deleteComment(req, res, next);
});
commentRoutes.put("/:commentID", authenticateUser, (req, res, next) => {
  controller.updateComment(req, res, next);
});
