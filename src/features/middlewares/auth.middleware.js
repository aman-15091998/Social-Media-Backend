import jwt from "jsonwebtoken";
import { ApplicationError } from "../ErrorHandler.js";
import { userRepositoty } from "../users/user.repository.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
      if (err) {
        // Token is invalid
        throw new ApplicationError(400, err.message);
      } else {
        // Token is valid checking
        req.user = payload; //object contains only email and _id
      }
    });
    // checking for token in the database also
    const userRepo = new userRepositoty();
    const response = await userRepo.getUserByEmail(req.user.email);
    const user = response.user;
    if (!user.tokens.includes(token)) {
      throw new ApplicationError(400, "Please login to continue");
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
