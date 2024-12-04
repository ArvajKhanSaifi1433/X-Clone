import { Router } from "express";
import {
  bookMarkTweet,
  follow,
  getMyProfile,
  getOtherUsers,
  loginUser,
  logoutUser,
  registerUser,
  unfollow,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(logoutUser);
userRouter.route("/bookmark/:_id").put(verifyJWT, bookMarkTweet);
userRouter.route("/profile/:_id").get(verifyJWT, getMyProfile);
userRouter.route("/otherUser").get(verifyJWT, getOtherUsers);
userRouter.route("/follow/:_id").post(verifyJWT, follow);
userRouter.route("/unfollow/:_id").post(verifyJWT, unfollow);

export default userRouter;
