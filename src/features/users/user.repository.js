import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { deleteFileIfPresent } from "../../utils/filedelete.js";
export const usersModel = mongoose.model("User", userSchema);
export class userRepositoty {
  // Read operations
  async getAllUsers() {
    try {
      const allUsers = await usersModel
        .find({})
        .select({ _id: 1, name: 1, email: 1, gender: 1 });
      if (allUsers.length == 0)
        return { success: false, message: "No users are there" };
      else {
        return { success: true, users: allUsers };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "No users are there" };
    }
  }
  async getUserById(userID) {
    try {
      const user = await usersModel.findById(userID);
      if (!user) return { success: false, message: "User ID is invalid" };
      else return { success: true, user };
    } catch (err) {
      console.log(err);
      return { success: false, message: "User ID is invalid" };
    }
  }
  // Write operations
  async updateUserById(userID, userDetails) {
    try {
      const user = await usersModel.findById(userID);
      if (!user) return { status: false, message: "Invalid user id" };
      user.name = userDetails.name;
      user.gender = userDetails.gender;
      if (user.avatar) {
        //delete old avatar file
        const file = user.avatar;
        deleteFileIfPresent(file);
        user.avatar = "";
      }
      if (userDetails.avatar) user.avatar = userDetails.avatar;
      await user.save();
      return { success: true, user: user };
    } catch (err) {
      console.log(err);
      return { success: false, message: err.message };
    }
  }
  async signUp(user) {
    try {
      const newUser = new usersModel(user);
      await newUser.save();
      return { success: true, user: newUser };
    } catch (err) {
      console.log(err);
      return { success: false, message: err.message };
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await usersModel.findOne({ email });
      if (!user) return { success: false, message: "user not found" };
      return { success: true, user: user };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }

  ///////////////////////////Friends repo inside user repo
  async getUserFriendsByID(userID, friendID) {
    try {
      const user = await usersModel.findById(userID);
      if (userID == friendID) {
        return { success: true, friends: user.friends };
      } else {
        if (!user.friends.includes(friendID))
          return {
            success: false,
            message: "Cannot access friends of non-friend users",
          };
        else {
          const friendUser = await usersModel.findById(friendID);
          return { success: true, friends: friendUser.friends };
        }
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
  async getFriendRequestsByID(userID) {
    try {
      const user = await usersModel.findById(userID);
      return {
        success: true,
        friendRequests: {
          incomingRequests: user.incomingRequests,
          outgoingRequests: user.outgoingRequests,
        },
      };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  }
  async toggleFriendByID(userID, friendID) {
    try {
      const friendUser = await usersModel.findById(friendID);
      if (!friendUser) return { success: false, message: "Invalid user ID" };
      const user = await usersModel.findById(userID);
      if (user.friends.includes(friendID)) {
        const friendIndex = user.friends.findIndex((fID) => fID == friendID);
        user.friends.splice(friendIndex, 1);
        await user.save();

        const userIndex = friendUser.friends.findIndex((fID) => fID == userID);
        friendUser.friends.splice(userIndex, 1);
        await friendUser.save();
        return { success: true, message: "Unfriended a user" };
      } else if (user.incomingRequests.includes(friendID)) {
        const friendIndex = user.incomingRequests.findIndex(
          (fID) => fID == friendID
        );
        user.incomingRequests.splice(friendIndex, 1);
        user.friends.push(friendID);
        await user.save();

        const userIndex = friendUser.outgoingRequests.findIndex(
          (uID) => uID == userID
        );
        friendUser.outgoingRequests.splice(userIndex, 1);
        friendUser.friends.push(userID);
        await friendUser.save();

        return {
          success: true,
          message: "Accepted a incoming pending friend request",
        };
      } else if (user.outgoingRequests.includes(friendID)) {
        const friendIndex = user.outgoingRequests.findIndex(
          (fID) => fID == friendID
        );
        user.outgoingRequests.splice(friendIndex, 1);
        await user.save();

        const userIndex = friendUser.incomingRequests.findIndex(
          (uID) => uID == userID
        );
        friendUser.incomingRequests.splice(userIndex, 1);
        await friendUser.save();
        return {
          success: true,
          message: "Cancelled a outgoing pending friend request",
        };
      } else {
        user.outgoingRequests.push(friendID);
        await user.save();
        friendUser.incomingRequests.push(userID);
        await friendUser.save();
        return {
          success: true,
          message: "Sent a friend request to the userID",
        };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "something went wrong" };
    }
  }
  async acceptOrRejectRequestByID(userID, friendID, accept) {
    try {
      const user = await usersModel.findById(userID);
      const friendUser = await usersModel.findById(friendID);
      if (!friendUser) return { success: false, message: "Invalid user ID" };
      if (!user.incomingRequests.includes(friendID))
        return {
          success: false,
          message: "no pending requests for the given userID",
        };

      const friendIndex = user.incomingRequests.findIndex(
        (fID) => fID == friendID
      );
      user.incomingRequests.splice(friendIndex, 1);

      const userIndex = friendUser.outgoingRequests.findIndex(
        (uID) => uID == userID
      );
      friendUser.outgoingRequests.splice(userIndex, 1);

      if (accept) {
        user.friends.push(friendID);
        await user.save();
        friendUser.friends.push(userID);
        await friendUser.save();
        return {
          success: true,
          message: "Accepted the friend request",
        };
      } else {
        //reject
        await user.save();
        await friendUser.save();
        return {
          success: true,
          message: "Rejected the friend request",
        };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "something went wrong" };
    }
  }
}
