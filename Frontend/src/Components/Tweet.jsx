import React from "react";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import useGetMyTweets from "../Hooks/useGetMyTweets";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { timeSince, TWEET_API_END_POINT, USER_API_END_POINT } from "../utils/constant";
import { getRefresh } from "../Redux/Slices/tweetSlice";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { toggleBookmark } from "../Redux/Slices/userSlice";

function Tweet() {
  const { tweets } = useSelector((store) => store.tweet);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useGetMyTweets();
  

  const likeDislike = async (id) => {
    try {
      const { data } = await axios.put(
        `${TWEET_API_END_POINT}/likeOrdislike/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      // console.log(data);
      if (data.success) {
        toast.success("Tweet is like");
      } else {
        toast.success("Tweet is disLike");
      }

      dispatch(getRefresh());
    } catch (error) {
      console.error(error); // Handle the error here
    }
  };

  const TweetBookmark = async (id) => {
    try {
      const { data } = await axios.put(
        `${USER_API_END_POINT}/bookmark/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      // console.log(data);
      if (data.success) {
        toast.success("Tweet is bookmark");
      } else {
        toast.success("Tweet is bookmark Remove");
      }

      dispatch(getRefresh());
      dispatch(toggleBookmark(id));
    } catch (error) {
      console.error(error); // Handle the error here
    }
  };

  const removeTweet = async (id) => {
    try {
      const { data } = await axios.delete(
        `${TWEET_API_END_POINT}/deleteTweet/${id}`,
        {
          withCredentials: true,
        }
      );
      // console.log(data);
      if (data.success) {
        toast.success(data.message);
      }

      dispatch(getRefresh());
    } catch (error) {
      console.error(error); // Handle the error here
    }
  };

  return (
    <div className="dark:bg-gray-900 dark:text-gray-100">
      <div>
        {tweets.map((tweet) => (
          <div
            key={tweet?._id}
            className="border-b py-4 px-4 dark:border-gray-700"
          >
            <div className="flex items-start">
              <img
                src="https://pbs.twimg.com/profile_images/1750178437351047168/EBouSx8G_400x400.jpg" // Sample profile image
                alt="profile"
                className="w-12 h-12 object-cover rounded-full border border-gray-300 dark:border-gray-600"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <div className="font-semibold text-gray-800 text-[17px] dark:text-gray-200">
                    {tweet?.userDetails[0]?.name}
                    <span className="text-gray-500 text-sm ml-2 dark:text-gray-400">
                      {tweet?.userDetails[0]?.userName}
                    </span>
                  </div>
                  <span className="text-gray-700 text-[15px] dark:text-gray-500">
                    &nbsp;&#46;&nbsp;{" "}
                    {timeSince(tweet?.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 text-[15px] font-sans dark:text-gray-300 text-lg mt-1">
                  {tweet?.description}
                </p>

                <div className="flex justify-between mt-3 text-xl">
                  <div className="cursor-pointer hover:text-cyan-500 dark:hover:text-cyan-300 inline-flex items-center gap-1">
                    <FaRegComment />
                    <p className="leading-3">0</p>
                  </div>
                  <div
                    className="cursor-pointer hover:text-red-500 dark:hover:text-red-400 inline-flex items-center gap-1"
                    onClick={() => {
                      likeDislike(tweet?._id);
                    }}
                  >
                    {tweet?.likes?.includes(user?._id) && (
                      <FaHeart className="text-red-500" />
                    )}
                    {!tweet?.likes?.includes(user?._id) && <FaRegHeart />}
                    <p className="leading-3">{tweet?.likes?.length || 0}</p>
                  </div>
                  <div
                    className="cursor-pointer hover:text-sky-500 dark:hover:text-sky-400"
                    onClick={() => {
                      TweetBookmark(tweet?._id);
                    }}
                  >
                    {user?.bookmarks?.includes(tweet?._id) && (
                      <FaBookmark className="text-sky-500" />
                    )}
                    {!user?.bookmarks?.includes(tweet?._id) && (
                      <FaRegBookmark />
                    )}
                  </div>
                  <div
                    className="cursor-pointer hover:text-red-500 dark:hover:text-red-400"
                    onClick={() => {
                      removeTweet(tweet?._id);
                    }}
                  >
                    <MdDelete />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tweet;
