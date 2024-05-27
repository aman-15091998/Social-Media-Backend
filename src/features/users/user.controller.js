import mongoose from "mongoose";
import bcrypt from "bcrypt";
import path from "path";
import { userSchema } from "./user.schema.js";
import { userRepositoty, usersModel } from "./user.repository.js";
import { ApplicationError } from "../ErrorHandler.js";
import jwt from "jsonwebtoken";

export class userController {
  constructor() {
    this.userRepository = new userRepositoty();
  }
  // Read operations
  async getAllUserDetailsWithoutPassword(req, res, next) {
    try {
      const response = await this.userRepository.getAllUsers();
      if (!response.success) throw new ApplicationError(404, response.message);
      else {
        const allUsers = response.users;
        res.status(200).send({
          success: true,
          users: allUsers,
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async getUserDetailsWithoutPassword(req, res, next) {
    try {
      const { userID } = req.params;
      const response = await this.userRepository.getUserById(userID);
      if (!response.success) throw new ApplicationError(404, response.message);
      else {
        const user = response.user;
        res.status(200).send({
          success: true,
          userDetails: {
            name: user.name,
            email: user.email,
            gender: user.gender,
          },
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  //Write operations
  async updateUserDetails(req, res, next) {
    try {
      const userID = req.user._id;
      const userObj = req.body;
      const file = req.file;
      if (file)
        userObj.avatar = path.join(
          "public",
          "assets",
          "avatars",
          file.filename
        ); // file.filename;
      const response = await this.userRepository.updateUserById(
        userID,
        userObj
      );
      if (!response.success) {
        throw new ApplicationError(400, response.message);
      } else
        res.status(201).send({
          success: true,
          user: {
            name: response.user.name,
            email: response.user.email,
            gender: response.user.gender,
            avatar: response.user.avatar,
          },
        });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async logoutAll(req, res, next) {
    try {
      const token = req.cookies.jwt;
      const response = await this.userRepository.getUserByEmail(req.user.email);
      const user = response.user;
      user.tokens = [];
      await user.save();
      res.clearCookie("jwt");
      res
        .status(200)
        .send({ success: true, message: "Logged out from everywhere" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async logout(req, res, next) {
    try {
      const token = req.cookies.jwt;
      const response = await this.userRepository.getUserByEmail(req.user.email);
      const user = response.user;
      const tokenIndex = user.tokens.findIndex((t) => t == token);
      if (tokenIndex >= 0) {
        user.tokens.splice(tokenIndex, 1);
        await user.save();
      }
      res.clearCookie("jwt");
      res.status(200).send({ success: true, message: "Log out successful" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async signUp(req, res, next) {
    try {
      const userObj = req.body;
      console.log(req.body);
      const isUser = this.userRepository.getUserByEmail(userObj.email);
      if (isUser.success)
        throw new ApplicationError(400, "User is already registered");

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(userObj.password, salt);
      userObj.password = hash;
      const isRegistered = await this.userRepository.signUp(userObj);
      if (!isRegistered.success) {
        throw new ApplicationError(400, isRegistered.message);
      }
      res.status(201).send({
        success: true,
        message: "Registration successfull!",
        user: isRegistered.user,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const response = await this.userRepository.getUserByEmail(email);
      console.log(response);
      if (!response.success)
        throw new ApplicationError(404, "User is not registered");
      else {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          response.user.password
        );
        const payload = { _id: response.user._id, email: response.user.email };
        if (isPasswordCorrect) {
          const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "1hr",
          });

          if (!response.user.tokens) response.user.tokens = [];
          response.user.tokens.push(token);
          await response.user.save();
          res.cookie("jwt", token);
          res
            .status(201)
            .send({ success: true, message: "Log in is successful!", token });
        } else throw new ApplicationError(400, "Incorrect credentials");
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  //////////////////////////Friend Controller functions inside user controller

  async getUserFriends(req, res, next) {
    try {
      const friendID = req.params.userID;
      const userID = req.user._id;
      const response = await this.userRepository.getUserFriendsByID(
        userID,
        friendID
      );
      if (!response.success) throw new ApplicationError(404, response.message);
      else res.status(200).send({ success: true, friends: response.friends });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async getPendingRequests(req, res, next) {
    try {
      const userID = req.user._id;
      const response = await this.userRepository.getFriendRequestsByID(userID);
      if (!response.success) throw new ApplicationError(404, response.message);
      else
        res
          .status(200)
          .send({ success: true, friends: response.friendRequests });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async toggleFriend(req, res, next) {
    try {
      const { friendID } = req.params;
      const userID = req.user._id;
      console.log(userID + " and friendID=" + friendID);
      if (userID == friendID)
        throw new ApplicationError(
          400,
          "User cannot add or remove self as friend"
        );
      else {
        const response = await this.userRepository.toggleFriendByID(
          userID,
          friendID
        );
        if (!response.success)
          throw new ApplicationError(404, response.message);
        else {
          res.status(201).send({ success: true, message: response.message });
        }
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async acceptOrRejectRequest(req, res, next) {
    try {
      const userID = req.user._id;
      const { friendID } = req.params;
      const { accept } = req.body;
      const response = await this.userRepository.acceptOrRejectRequestByID(
        userID,
        friendID,
        accept
      );
      if (!response.success) throw new ApplicationError(400, response.message);
      else res.status(201).send({ success: true, message: response.message });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
