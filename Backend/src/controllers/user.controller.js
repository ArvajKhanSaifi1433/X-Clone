import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;

    // console.log(req.body);

    if (
      [name, userName, email, password].some((item) => item?.trim() === "") ||
      [name, userName, email, password].some((item) => item === undefined)
    ) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const existedUser = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (existedUser) {
      return res.status(409).json(new ApiError(409, "User already exists"));
    }

    const createdUser = await User.create({
      name,
      userName,
      email: email.toLowerCase(),
      password,
    });

    const user = await User.findById(createdUser._id).select("-password");

    if (!user) {
      return res
        .status(500)
        .json(
          new ApiError(500, "Something went wrong while registering the user")
        );
    }

    res
      .status(201)
      .json(new ApiResponse(201, user, "User successfully registered"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log(req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiError(400, "Password or Email is required"));
    }

    const existedUser = await User.findOne({ email });

    if (!existedUser) {
      return res.status(404).json(new ApiError(404, "User is not found"));
    }

    const isPasswordValid = await existedUser.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json(new ApiError(401, "password is incorrect"));
    }

    const loggedInUser = await User.findById(existedUser._id).select(
      "-password"
    );

    if (!loggedInUser) {
      return res
        .status(404)
        .json(new ApiError(404, "User details could not be retrieved."));
    }

    const accessToken = loggedInUser.generateAccessToken();

    // Calculate expiration date (1 days from now)

    const expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

    /* 
  new Date(Date.now()) ==> current date time
  new Date(0) ==> 1st junbery 1970
  1 days
  24 hours per day
  60 minutes per hour
  60 seconds per minute
  1000 milliseconds per second
  */

    const options = {
      httpOnly: true, // Can't be accessed via JavaScript (helps mitigate XSS attacks)
      expires, // A date object specifying when the cookie should expire
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, loggedInUser, "User login successful"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

const logoutUser = async (req, res) => {
  try {
    const options = {
      httpOnly: true, // can't access throw js
      expires: new Date(0),
      secure: true,
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

const bookMarkTweet = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;
    const tweetId = req.params?._id;

    if (!loggedInUserId || !tweetId) {
      return res
        .status(400)
        .json(new ApiError(400, "User ID and Tweet ID are required."));
    }

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    const alreadyBookmarked = user.bookmarks.includes(tweetId);

    if (alreadyBookmarked) {
      // Remove bookmark
      await User.findByIdAndUpdate(
        loggedInUserId,
        {
          $pull: { bookmarks: tweetId },
        },
        { new: true }
      );
      return res
        .status(200)
        .json(
          new ApiResponse(400, {}, "Tweet removed from bookmarks successfully.")
        );
    } else {
      // Add bookmark
      await User.findByIdAndUpdate(
        loggedInUserId,
        {
          $addToSet: { bookmarks: tweetId },
        },
        { new: true }
      );
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet bookmarked successfully."));
    }
  } catch (error) {
    console.error(error); // Use console.error for errors
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

const getMyProfile = async (req, res) => {
  try {
    const loggedInUserId = req.params?._id;

    if (!loggedInUserId) {
      return res.status(400).json(new ApiError(400, "User ID is missing."));
    }

    const userProfile = await User.findById(loggedInUserId).select("-password");

    if (!userProfile) {
      return res.status(404).json(new ApiError(404, "User profile not found."));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, userProfile, "Profile retrieved successfully.")
      );
  } catch (error) {
    console.error(error); // Use console.error for errors
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

const getOtherUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;

    // Check if the user ID is available
    if (!loggedInUserId) {
      return res.status(400).json(new ApiError(400, "User ID is missing."));
    }

    // Fetch all users except the logged-in user
    const otherUsers = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password") // Exclude the password field for security
      .sort({ createdAt: -1 }); // Sort by creation date, descending

    // Check if there are no other users
    if (!otherUsers.length) {
      return res.status(404).json(new ApiError(404, "No other users found."));
    }

    // Send a successful response
    return res
      .status(200)
      .json(
        new ApiResponse(200, otherUsers, "Other users retrieved successfully.")
      );
  } catch (error) {
    console.error("Error retrieving other users:", error); // Log the error with context
    return res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred.")); // Return a 500 error
  }
};

/* const follow = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id; // meri id
    const followUserId = req.params?._id; // jise me follow kar raha hu uski id

    if (!loggedInUserId) {
      return res.status(400).json(new ApiError(400, "User ID is missing."));
    }

    if (!followUserId) {
      return res
        .status(400)
        .json(new ApiError(400, "User to follow ID is missing."));
    }

    if (loggedInUserId === followUserId) {
      return res
        .status(400)
        .json(new ApiError(400, "You cannot follow yourself."));
    }

    const loggedInUser = await User.findById(loggedInUserId);
    const userToFollow = await User.findById(followUserId);

    if (!userToFollow) {
      return res
        .status(404)
        .json(new ApiError(404, "User to follow not found."));
    }

    if (!loggedInUser) {
      return res
        .status(404)
        .json(new ApiError(404, "Logged-in user not found."));
    }

    const followAlready = userToFollow.followers.includes(loggedInUserId);

    if (!followAlready) {
      await userToFollow.updateOne({
        $addToSet: { followers: loggedInUserId },
      });
      await loggedInUser.updateOne({
        $addToSet: { following: followUserId },
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            `${loggedInUser.name} just follow to ${userToFollow.name}`
          )
        );
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            `${loggedInUser.name} already followed to ${userToFollow.name}`
          )
        );
    }
  } catch (error) {
    console.error(error); // Use console.error for errors
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
}; */

/* const follow = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id; // meri id
    const followUserId = req.params?._id; // jise me follow kar raha hu uski id

    if (!loggedInUserId) {
      return res.status(400).json(new ApiError(400, "User ID is missing."));
    }

    if (!followUserId) {
      return res
        .status(404)
        .json(new ApiError(404, "Follow user is not found."));
    }

    if (loggedInUserId === followUserId) {
      return res
        .status(400)
        .json(new ApiError(400, "You cannot follow yourself."));
    }

    const userToFollow = await User.findById(followUserId);

    const alreadyFollowUser = userToFollow.followers.includes(loggedInUserId);

    if (!alreadyFollowUser) {
      const followUser = await User.findByIdAndUpdate(
        followUserId,
        {
          $addToSet: { followers: loggedInUserId },
        },
        { new: true }
      );

      const followingUser = await User.findByIdAndUpdate(
        loggedInUserId,
        {
          $addToSet: { following: followUserId },
        },
        { new: true }
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            `${followingUser.name} just follow to ${followUser.name}`
          )
        );
    } else {
      return res.status(200).json(new ApiResponse(200, {}, `already follow`));
    }
  } catch (error) {
    console.error(error); // Use console.error for errors
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
}; */

const follow = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;
    const followUserId = req.params?._id;

    if (!loggedInUserId || !followUserId) {
      return res.status(400).json(new ApiError(400, "User IDs are missing."));
    }

    if (loggedInUserId === followUserId) {
      return res
        .status(400)
        .json(new ApiError(400, "You cannot follow yourself."));
    }

    const [userToFollow, loggedInUser] = await Promise.all([
      User.findById(followUserId),
      User.findById(loggedInUserId),
    ]);

    if (!userToFollow) {
      return res
        .status(404)
        .json(new ApiError(404, "User to follow not found."));
    }

    if (!loggedInUser) {
      return res
        .status(404)
        .json(new ApiError(404, "Logged-in user not found."));
    }

    const alreadyFollowing = userToFollow.followers.includes(loggedInUserId);

    if (alreadyFollowing) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            `${loggedInUser.name} is already following ${userToFollow.name}`
          )
        );
    }

    await Promise.all([
      User.findByIdAndUpdate(
        followUserId,
        {
          $addToSet: { followers: loggedInUserId },
        },
        { new: true }
      ),
      User.findByIdAndUpdate(
        loggedInUserId,
        {
          $addToSet: { following: followUserId },
        },
        { new: true }
      ),
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          `${loggedInUser.name} just followed ${userToFollow.name}`
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;
    const followUserId = req.params?._id;

    if (!loggedInUserId || !followUserId) {
      return res.status(400).json(new ApiError(400, "User IDs are missing."));
    }

    if (loggedInUserId === followUserId) {
      return res
        .status(400)
        .json(new ApiError(400, "You cannot unfollow yourself."));
    }

    const [userToFollow, loggedInUser] = await Promise.all([
      User.findById(followUserId),
      User.findById(loggedInUserId),
    ]);

    if (!userToFollow) {
      return res
        .status(404)
        .json(new ApiError(404, "User to unfollow not found."));
    }

    if (!loggedInUser) {
      return res
        .status(404)
        .json(new ApiError(404, "Logged-in user not found."));
    }

    const alreadyFollowing = userToFollow.followers.includes(loggedInUserId);

    if (!alreadyFollowing) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            `${loggedInUser.name} is not following ${userToFollow.name}`
          )
        );
    }

    await Promise.all([
      User.findByIdAndUpdate(
        followUserId,
        {
          $pull: { followers: loggedInUserId },
        },
        { new: true }
      ),
      User.findByIdAndUpdate(
        loggedInUserId,
        {
          $pull: { following: followUserId },
        },
        { new: true }
      ),
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          `${loggedInUser.name} just unfollowed ${userToFollow.name}`
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiError(500, "An internal server error occurred."));
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  bookMarkTweet,
  getMyProfile,
  getOtherUsers,
  follow,
  unfollow,
};
