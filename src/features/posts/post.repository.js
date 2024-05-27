import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import { usersModel } from "../users/user.repository.js";
import { deleteFileIfPresent } from "../../utils/filedelete.js";
import { likesModel } from "../Likes/like.repository.js";
import { commentsModel } from "../comments/comment.repository.js";

export const postsModel = mongoose.model("Post", postSchema);
export class postRepository {
  async allPosts(userID) {
    try {
      const user = await usersModel.findById(userID);
      const allPosts = await postsModel.find({ userID: { $in: user.friends } });
      if (allPosts.length == 0)
        return { success: false, message: "No posts are there" };
      else return { success: true, posts: allPosts };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
  async allPostByUserID(userID) {
    try {
      const allPosts = await postsModel.find({ userID });
      if (allPosts.length == 0)
        return { success: false, message: "No posts are there for this user" };
      else return { success: true, posts: allPosts };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
  async getPostById(postID) {
    try {
      const post = await postsModel.findById(postID);
      if (!post) return { success: false, message: "Invalid post ID" };
      else return { success: true, post: post };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
  async addPost(userID, postObj) {
    try {
      const newPost = new postsModel(postObj);
      await newPost.save();
      const user = await usersModel.findById(userID);
      user.posts.push(newPost._id);
      await user.save();
      return { success: true, post: newPost };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
  async updatePostByID(userID, postID, postObj) {
    try {
      const post = await postsModel.findOne({ userID: userID, _id: postID });
      if (!post) return { success: false, message: "Bad request" };
      if (post.imageUrl) {
        const file = post.imageUrl;
        deleteFileIfPresent(file);
        post.imageUrl = undefined;
      }
      post.caption = postObj.caption;
      post.imageUrl = postObj.imageUrl;
      post.uploadedOn = Date.now();
      await post.save();
      return { success: true, post: post };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
  async deletePostByID(userID, postID) {
    try {
      const post = await postsModel.findOne({ _id: postID, userID: userID });
      if (!post) return { success: false, message: "Bad request" };
      if (post.imageUrl) deleteFileIfPresent(post.imageUrl);
      const deletedPost = await postsModel.deleteOne({
        userID: userID,
        _id: postID,
      });
      if (!deletedPost) return { success: false, message: "Bad request" };
      else {
        const user = await usersModel.findById(userID);
        const postIndex = user.posts.findIndex((pID) => pID == postID);
        user.posts.splice(postIndex, 1); //remove post from user's document
        await user.save();
        const allCommentsIDForThisPost = await commentsModel
          .find({ postID: postID })
          .select({ _id: 1 });
        console.log(allCommentsIDForThisPost);
        await likesModel.deleteMany({
          $or: [
            { likeable: postID },
            { likeable: { $in: allCommentsIDForThisPost } },
          ],
        }); //delete all like documents fot this post
        await commentsModel.deleteMany({ postID: postID });
        return { success: true, post: post };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
}
