import mongoose from "mongoose";

export const likeSchema = mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likeable: {
    type: mongoose.Types.ObjectId,
    refPath: "model",
    required: true,
  },
  model: {
    type: String,
    enum: ["Post", "Comment"],
    message: 'Model must be either "Post" or "Comment"',
    required: true,
  },
});
