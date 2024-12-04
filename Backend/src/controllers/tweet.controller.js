import Tweet from "../models/tweet.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.user?._id;

    if (!description) {
      return res
        .status(400)
        .json(new ApiError(400, "Description is required."));
    }

    if (!userId) {
      return res.status(400).json(new ApiError(400, "User ID is required."));
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    const createT = await Tweet.create({
      description,
      userId,
      userDetails: user,
    });

    const createTexists = await Tweet.findById(createT._id).select("-password");

    if (!createTexists) {
      return res
        .status(500)
        .json(
          new ApiError(500, "Something went wrong while Tweet create time")
        );
    }

    res
      .status(201)
      .json(new ApiResponse(200, {}, "Tweet created successfully."));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

const deleteTweet = async (req, res) => {
  try {
    const _id = req.params?._id;

    if (!_id) {
      return res.status(404).json(new ApiError(404, "Tweet Id is not found"));
    }

    // Find and delete the tweet
    const deletedTweet = await Tweet.findByIdAndDelete(_id);

    if (!deletedTweet) {
      return res.status(404).json(new ApiError(404, "Tweet not found."));
    }

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet deleted successfully."));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

const LikeOrDislike = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;
    const tweetId = req.params?._id;

    if (!loggedInUserId || !tweetId) {
      return res
        .status(400)
        .json(new ApiError(400, "User ID and Tweet ID are required."));
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json(new ApiError(404, "Tweet not found."));
    }

    const alreadyLiked = tweet.likes.includes(loggedInUserId);

    if (alreadyLiked) {
      // Remove like
      await Tweet.findByIdAndUpdate(
        tweetId,
        {
          $pull: { likes: loggedInUserId },
        },
        { new: true }
      );
      return res
        .status(200)
        .json(new ApiResponse(400, {}, "User disliked your tweet."));
    } else {
      // Add like
      await Tweet.findByIdAndUpdate(
        tweetId,
        {
          $addToSet: { likes: loggedInUserId },
        },
        { new: true }
      );
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "User liked your tweet."));
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

// this controller performance is not good
/* const getAllTweets = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      return res.status(400).json(new ApiError(400, "User not authenticated."));
    }

    // Fetch logged-in user's tweets
    const [loggedInUserTweet, user] = await Promise.all([
      Tweet.find({
        userId: loggedInUserId,
      }),
      User.findById(loggedInUserId),
    ]);

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    // Fetch tweets from following users

    const followingUserTweets = await Promise.all(
      user.following.map((followingId) => Tweet.find({ userId: followingId }))
    );

    //    [
    //   [],
    //   [],
    //   [
    //     {
    //       _id: new ObjectId('66e867cdd904c5085fe80481'),
    //       description: 'i am khusboo saifi',
    //       likes: [],
    //       userId: new ObjectId('66e6a5405787a766bd05669e'),
    //       userDetails: [Array],
    //       createdAt: 2024-09-16T17:15:57.110Z,
    //       updatedAt: 2024-09-16T17:15:57.110Z,
    //       __v: 0
    //     }
    //   ]
    // ]

    // console.log(followingUserTweets);

    // Flatten the array of arrays
    const allTweets = loggedInUserTweet.concat(...followingUserTweets);

    res
      .status(200)
      .json(
        new ApiResponse(200, allTweets, "All tweets retrieved successfully.")
      );
  } catch (error) {
    console.error(error); // Use console.error for logging errors
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
}; */

const getAllTweets = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      return res.status(400).json(new ApiError(400, "User not authenticated."));
    }

    const [loggedInUserTweets, user] = await Promise.all([
      Tweet.find({ userId: loggedInUserId }),
      User.findById(loggedInUserId),
    ]);

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    const followingUserTweets = await Tweet.find({
      userId: { $in: user.following },
    });

    /* [
  {
    _id: new ObjectId('66e867cdd904c5085fe80481'),
    description: 'i am khusboo saifi',
    likes: [],
    userId: new ObjectId('66e6a5405787a766bd05669e'),
    userDetails: [ [Object] ],
    createdAt: 2024-09-16T17:15:57.110Z,
    updatedAt: 2024-09-16T17:15:57.110Z,
    __v: 0
  }
] */
    const allTweets = [...loggedInUserTweets, ...followingUserTweets].sort(
      (a, b) => b.createdAt - a.createdAt
    ); // Assuming tweets have a `createdAt` field

    res
      .status(200)
      .json(
        new ApiResponse(200, allTweets, "All tweets retrieved successfully.")
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

const getFollowingTweets = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      return res.status(400).json(new ApiError(400, "User not authenticated."));
    }

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User is not found."));
    }

    const followingUserTweets = await Tweet.find({
      userId: { $in: user.following },
    });

    const allTweets = [...followingUserTweets].sort(
      (a, b) => b.createdAt - a.createdAt
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, allTweets, "All tweets retrieved successfully.")
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

export {
  createTweet,
  deleteTweet,
  LikeOrDislike,
  getAllTweets,
  getFollowingTweets,
};
