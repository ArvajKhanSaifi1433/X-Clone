import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getFollowingTweets,
  LikeOrDislike,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const tweetRouter = Router();

tweetRouter.route("/createTweet").post(verifyJWT, createTweet);
tweetRouter.route("/deleteTweet/:_id").delete(verifyJWT, deleteTweet);
tweetRouter.route("/likeOrdislike/:_id").put(verifyJWT, LikeOrDislike);
tweetRouter.route("/getAllTweet").get(verifyJWT, getAllTweets);
tweetRouter.route("/getFollowingTweets").get(verifyJWT, getFollowingTweets);

export default tweetRouter;
