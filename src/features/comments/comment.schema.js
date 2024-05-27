import mongoose from "mongoose";

export const commentSchema = mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  postID: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
  text: {
    type: String,
    required: true,
  },
  uploadedOn: {
    type: Number,
    default: Date.now(),
  },
  Likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Like",
    },
  ],
});
