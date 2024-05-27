import { response } from "express";
import { ApplicationError } from "../ErrorHandler.js";
import { likeRepository } from "./like.repository.js";

export class likeController {
  constructor() {
    this.likeRepository = new likeRepository();
  }
  async getLikes(req, res, next) {
    try {
      const { ID } = req.params;
      const response = await this.likeRepository.getLikesByID(ID);
      if (!response.success) throw new ApplicationError(404, response.message);
      else res.status(200).send({ success: true, likes: response.likes });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async addOrRemoveLike(req, res, next) {
    try {
      const { model } = req.body;
      const userID = req.user._id;
      const { ID } = req.params;
      const response = await this.likeRepository.addOrRemoveLikeByID(
        userID,
        ID,
        model
      );
      if (!response) throw new ApplicationError(400, response.message);
      res.status(201).send({ success: true, message: response.message });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
