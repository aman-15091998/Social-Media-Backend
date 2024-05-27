import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { likeController } from "./like.controller.js";

const controller = new likeController();
export const likeRoutes = Router();
likeRoutes.get("/:ID", authenticateUser, (req, res, next) => {
  controller.getLikes(req, res, next);
});
likeRoutes.post("/toggle/:ID", authenticateUser, (req, res, next) => {
  controller.addOrRemoveLike(req, res, next);
});
