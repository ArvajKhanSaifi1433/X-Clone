import axios from "axios";
import React from "react";
import {
  FaHashtag,
  FaBell,
  FaUser,
  FaBookmark,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import {
  getMyProfile,
  getOtherUsers,
  getUser,
} from "../Redux/Slices/UserSlice";
import { getAllTweets, getIsActive, getRefresh } from "../Redux/Slices/tweetSlice";

function LeftSidebar({ isDarkMode, handleDarkModeToggle }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data?.message);
        // You might want to redirect or update the state after logout
      }
      dispatch(getUser(null));
      dispatch(getOtherUsers([]));
      dispatch(getMyProfile(null));
      dispatch(getAllTweets([]));
      dispatch(getRefresh(false));
      dispatch(getIsActive(true));
      navigate("/login");
    } catch (error) {
      console.error(error); // Handle the error here
      toast.error("An error occurred while logging out.");
    }
  };

  return (
    <div className="w-[20%] h-screen sticky top-0 bg-white dark:bg-gray-900 pb-8 pe-2">
      <div className="flex items-center my-4">
        <img
          src="https://www.edigitalagency.com.au/wp-content/uploads/new-Twitter-logo-x-black-png-1200x1227.png"
          alt="Twitter logo"
          className="w-6 ml-6"
        />
        <p
          className={`text-gray-900 dark:text-white cursor-pointer ps-2 border-2 rounded-lg select-none gradient-border p-1 ml-4 ${
            isDarkMode ? "border-0" : "border-transparent"
          }`}
          onClick={handleDarkModeToggle}
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </p>
      </div>
      <div className="my-4">
        <Link
          to="/"
          className="flex items-center gap-3 my-2 px-4 py-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FaHome size={24} className="text-gray-900 dark:text-gray-200" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Home
          </p>
        </Link>
        <div className="flex items-center gap-3 my-2 px-4 py-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <FaHashtag size={24} className="text-gray-900 dark:text-gray-200" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Explore
          </p>
        </div>
        <div className="flex items-center gap-3 my-2 px-4 py-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <FaBell size={24} className="text-gray-900 dark:text-gray-200" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </p>
        </div>
        <Link
          to={`/profile/${user?._id}`}
          className="flex items-center gap-3 my-2 px-4 py-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FaUser size={24} className="text-gray-900 dark:text-gray-200" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile
          </p>
        </Link>
        <div className="flex items-center gap-3 my-2 px-4 py-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <FaBookmark size={24} className="text-gray-900 dark:text-gray-200" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Bookmarks
          </p>
        </div>
        <div
          className="flex items-center gap-3 my-2 px-4 py-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={logoutHandler}
        >
          <FaSignOutAlt
            size={24}
            className="text-gray-900 dark:text-gray-200"
          />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Logout
          </p>
        </div>

        <button className="px-4 py-2 bg-sky-400 hover:bg-sky-500 dark:bg-sky-600 dark:hover:bg-sky-700 w-full rounded-full text-white font-semibold">
          Post
        </button>
      </div>
    </div>
  );
}

export default LeftSidebar;
