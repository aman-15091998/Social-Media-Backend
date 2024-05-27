import multer from "multer";
import { ApplicationError } from "../features/ErrorHandler.js";

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/avatars");
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toString().replaceAll(":", "_");
    cb(null, timestamp + file.originalname);
  },
});
const postImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/posts");
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toString().replaceAll(":", "_");
    cb(null, timestamp + file.originalname);
  },
});

export const upload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new ApplicationError(400, "Files other than image is not supported"),
        false
      );
    }
  },
});
export const postUpload = multer({
  storage: postImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new ApplicationError(400, "Files other than image is not supported"),
        false
      );
    }
  },
});
