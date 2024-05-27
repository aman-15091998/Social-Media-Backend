import { ApplicationError } from "../../features/ErrorHandler.js";
import { commentRepository } from "./comment.repository.js";
export class commentController {
  constructor() {
    this.commentRepository = new commentRepository();
  }
  async getComments(req, res, next) {
    try {
      const { postID } = req.params;
      const userID = req.user._id;
      const response = await this.commentRepository.getCommentsByPostID(
        userID,
        postID
      );
      if (!response.success) throw new ApplicationError(400, response.message);
      else res.status(200).send({ success: true, comments: response.comments });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async postComment(req, res, next) {
    try {
      const userID = req.user._id;
      const { postID } = req.params;
      const { text } = req.body;
      const response = await this.commentRepository.addCommentToPostID(
        userID,
        postID,
        text
      );
      if (!response.success) throw new ApplicationError(400, response.message);
      else res.status(201).send({ success: true, comment: response.comment });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async deleteComment(req, res, next) {
    try {
      const userID = req.user._id;
      const { commentID } = req.params;
      const response = await this.commentRepository.deleteCommentByID(
        userID,
        commentID
      );
      if (!response.success) throw new ApplicationError(400, response.message);
      else
        res
          .status(201)
          .send({ success: true, comment: response.deletedComment });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async updateComment(req, res, next) {
    try {
      const userID = req.user._id;
      const { text } = req.body;
      const { commentID } = req.params;
      const response = await this.commentRepository.updateCommentByID(
        userID,
        commentID,
        text
      );
      if (!response.success) throw new ApplicationError(400, response.message);
      else
        res
          .status(201)
          .send({ success: true, comment: response.updatedComment });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
