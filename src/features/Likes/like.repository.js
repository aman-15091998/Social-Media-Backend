import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { postsModel } from "../posts/post.repository.js";
import { commentsModel } from "../comments/comment.repository.js";
export const likesModel = mongoose.model("Like", likeSchema);

export class likeRepository {
  async getLikesByID(ID) {
    try {
      const likes = await likesModel.find({ likeable: ID });
      if (!likes || likes.length == 0)
        return {
          success: false,
          message: "This post or comment has zero likes.",
        };
      else return { success: true, likes: likes };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
  async addOrRemoveLikeByID(userID, ID, onModel) {
    try {
      let model;
      if (onModel == "Post") model = await postsModel.findById(ID);
      else if (onModel == "Comment") model = await commentsModel.findById(ID);
      if (!model) return { success: false, message: "Model is invalid" };
      const likePresent = await likesModel.findOne({
        userID: userID,
        likeable: ID,
      });
      if (!likePresent) {
        const newLike = new likesModel({
          likeable: ID,
          model: onModel,
          userID: userID,
        });
        await newLike.save();
        model.Likes.push(newLike._id);
        await model.save();
        return { success: true, message: "added new Like" };
      } else {
        await likesModel.deleteOne({ userID: userID, likeable: ID });
        const likeIndex = model.Likes.findIndex(
          (LID) => LID == likePresent._id
        );
        model.Likes.splice(likeIndex, 1);
        await model.save();
        return { success: true, message: "removed like" };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
}
