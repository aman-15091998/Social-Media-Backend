import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  avatar: {
    type: "String",
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
    message: `Gender can be either "Male", "Female" or "Other".`,
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    validate: {
      validator: function (value) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      },
      message: "Email is invalid!",
    },
  },
  password: {
    type: String,
    required: true,
    validate: function (value) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/.test(
        value
      );
    },
    message:
      "Password must be:\nAt least 8 characters long\nContains at least one lowercase letter\nContains at least one uppercase letter\nContains at least one digit\nContains at least one special character (!@#$%^&*())",
  },
  tokens: [
    {
      type: String,
    },
  ],
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  friends: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  incomingRequests: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  outgoingRequests: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  otp: {
    type: Number,
  },
});
