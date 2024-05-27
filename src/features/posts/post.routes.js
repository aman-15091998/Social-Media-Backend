import { Router } from "express";
import { postUpload } from "../../config/multer.config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { postController } from "./post.controller.js";

export const postRoutes = Router();
const controller = new postController();
postRoutes.get("/", authenticateUser, (req, res, next) => {
  controller.getUserPosts(req, res, next);
});
postRoutes.post(
  "/",
  authenticateUser,
  postUpload.single("file"),
  (req, res, next) => {
    controller.createNewPost(req, res, next);
  }
);

postRoutes.get("/all", authenticateUser, (req, res, next) => {
  controller.getAllPosts(req, res, next);
});
postRoutes.get("/:postID", authenticateUser, (req, res, next) => {
  controller.getPost(req, res, next);
});
postRoutes.put(
  "/:postID",
  authenticateUser,
  postUpload.single("file"),
  (req, res, next) => {
    controller.updatePost(req, res, next);
  }
);
postRoutes.delete("/:postID", authenticateUser, (req, res, next) => {
  controller.deletePost(req, res, next);
});
