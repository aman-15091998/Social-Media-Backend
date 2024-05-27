import mongoose from "mongoose";

export const postSchema = mongoose.Schema({
  imageUrl: {
    type: String,
  },
  caption: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  uploadedOn: {
    type: Number,
    default: Date.now(),
  },
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
  Likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Like",
    },
  ],
});
