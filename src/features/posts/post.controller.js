import path from "path";
import { ApplicationError } from "../ErrorHandler.js";
import { postRepository } from "./post.repository.js";

export class postController {
  constructor() {
    this.postRepository = new postRepository();
  }
  async deletePost(req, res, next) {
    try {
      const userID = req.user._id;
      const { postID } = req.params;
      const response = await this.postRepository.deletePostByID(userID, postID);
      if (!response.success) {
        throw new ApplicationError(400, response.message);
      } else {
        res.status(200).send({ success: true, post: response.post });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async updatePost(req, res, next) {
    try {
      const userID = req.user._id;
      const { postID } = req.params;
      const postObj = req.body;
      const file = req.file;
      if (file)
        postObj.imageUrl = path.join(
          "public",
          "assets",
          "posts",
          file.filename
        );
      const response = await this.postRepository.updatePostByID(
        userID,
        postID,
        postObj
      );
      if (!response.success) {
        throw new ApplicationError(400, response.message);
      } else {
        res.status(200).send({ success: true, post: response.post });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async getAllPosts(req, res, next) {
    try {
      const userID = req.user._id;
      const response = await this.postRepository.allPosts(userID);
      if (!response.success) {
        throw new ApplicationError(400, response.message);
      } else {
        res.status(200).send({ success: true, posts: response.posts });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async getUserPosts(req, res, next) {
    try {
      const userID = req.user._id;
      const response = await this.postRepository.allPostByUserID(userID);
      if (!response.success) {
        throw new ApplicationError(400, response.message);
      } else {
        res.status(200).send({ success: true, posts: response.posts });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async getPost(req, res, next) {
    try {
      const { postID } = req.params;
      const response = await this.postRepository.getPostById(postID);
      if (!response.success) {
        throw new ApplicationError(400, response.message);
      } else {
        res.status(200).send({ success: true, post: response.post });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async createNewPost(req, res, next) {
    try {
      const userID = req.user._id;
      const postObj = req.body;
      postObj.userID = userID;
      const file = req.file;
      if (file)
        postObj.imageUrl = path.join(
          "public",
          "assets",
          "posts",
          file.filename
        );
      const response = await this.postRepository.addPost(userID, postObj);
      if (!response.success) {
        throw new ApplicationError(400, response.message);
      } else {
        res.status(200).send({ success: true, post: response.post });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
