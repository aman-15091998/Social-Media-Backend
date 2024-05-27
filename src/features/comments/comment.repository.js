import mongoose from "mongoose";
import { commentSchema } from "./comment.schema.js";
import { postsModel } from "../posts/post.repository.js";
import { usersModel } from "../users/user.repository.js";
import { likesModel } from "../Likes/like.repository.js";

export const commentsModel = mongoose.model("Comment", commentSchema);

export class commentRepository {
  async updateCommentByID(userID, commentID, text) {
    try {
      const comment = await commentsModel.findOne({
        _id: commentID,
        userID: userID,
      });
      if (!comment)
        return {
          success: false,
          message: "Invalid comment ID or cannot update other's comments",
        };
      else {
        comment.text = text;
        comment.uploadedOn = Date.now();
        await comment.save();
        return { success: true, updatedComment: comment };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
  async deleteCommentByID(userID, commentID) {
    try {
      const comment = await commentsModel.findById(commentID);
      if (!comment) return { success: false, message: "Invalid comment ID" };
      if (comment.userID == userID) {
        //curent user's comment
        const post = await postsModel.findById(comment.postID);
        const commentIndex = post.comments.findIndex((cID) => cID == commentID); //remove comment ID -- update post document
        post.comments.splice(commentIndex, 1);
        await post.save();
        await likesModel.deleteMany({ likeable: commentID }); //deleting like documents for the comment
        await commentsModel.deleteOne({ _id: commentID }); //remove comment from comment collection
        return { success: true, deletedComment: comment };
      } //not a current user's comment (then the post must be of the current user)
      else {
        const postID = comment.postID;
        const post = await postsModel.findOne({ _id: postID, userID: userID });
        if (!post)
          return {
            success: false,
            message:
              "Invalid post ID or cannot delete other user's comments from other's posts",
          };
        else {
          const commentIndex = post.comments.findIndex(
            (cID) => cID == commentID
          );
          post.comments.splice(commentIndex, 1); //remove comment ID -- update post document
          await post.save();
          await likesModel.deleteMany({ likeable: commentID }); //deleting like documents for the comment
          await commentsModel.deleteOne({ _id: commentID }); //remove comment from comment collection
          return { success: true, deletedComment: comment };
        }
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
  async addCommentToPostID(userID, postID, text) {
    try {
      const user = await usersModel.findById(userID);
      const userArr = [userID, ...user.friends];
      const post = await postsModel.findOne({
        userID: { $in: userArr },
        _id: postID,
      });
      if (!post) return { success: false, message: "Invalid post ID" };
      else {
        const comment = await commentsModel({ text, userID, postID });
        await comment.save();
        post.comments.push(comment._id);
        await post.save();
        return { success: true, comment: comment };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
  async getCommentsByPostID(userID, postID) {
    try {
      const user = await usersModel.findById(userID);
      const userArr = [userID, ...user.friends];
      const post = await postsModel
        .findOne({ userID: { $in: userArr }, _id: postID })
        .populate("comments")
        .exec();
      if (!post) return { success: false, message: "Invalid post ID" };
      else {
        return { success: true, comments: post.comments };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
}
