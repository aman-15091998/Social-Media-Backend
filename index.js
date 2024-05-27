import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/mongo.config.js";
import { userRoutes } from "./src/features/users/user.routes.js";
import { ApplicationError } from "./src/features/ErrorHandler.js";
import { postRoutes } from "./src/features/posts/post.routes.js";
import { commentRoutes } from "./src/features/comments/comment.routes.js";
import { likeRoutes } from "./src/features/Likes/like.routes.js";
import { friendRoutes } from "./src/features/friends/friend.routes.js";
import { otpRoutes } from "./src/features/otp/otp.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/otp/", otpRoutes);
// Error 404
app.use((req, res) => {
  res.status(404).send("Page not Found");
});
// Appication Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = "Something went wrong";
  if (err instanceof ApplicationError) {
    message = err.message;
  }
  res.status(statusCode).send({ error: message });
});

// Server setup
app.listen(3001, async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.log("database connection failed!");
  } else {
    console.log("database is connected");
  }
  console.log("server is active");
});
