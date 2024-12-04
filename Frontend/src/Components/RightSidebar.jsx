import React from "react";
import { IoIosSearch } from "react-icons/io";
import { useSelector } from "react-redux";
import useGetOthersUsers from "../Hooks/useGetOthersUsers";
import { Link } from "react-router-dom";

function RightSidebar() {
  const user = useSelector((select) => select.user);
  useGetOthersUsers();
 
  return (
    <div className="w-[25%] h-screen sticky top-0 bg-white dark:bg-gray-900 pb-8 ps-2">
      {/* Search Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 w-full flex gap-4 items-center rounded-2xl p-2 mt-2">
        <IoIosSearch size={20} className="text-gray-400 dark:text-gray-500" />
        <input
          type="search"
          className="bg-gray-100 dark:bg-gray-800 focus:outline-none w-full placeholder:text-sm text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Search"
        />
      </div>

      <div className="mt-4">
        <div className="border rounded-2xl border-gray-200 dark:border-gray-700 pt-3">
          <h3 className="font-bold text-lg px-4 text-gray-900 dark:text-white">
            Who to Follow
          </h3>
          <div className="px-4 mt-4">
            <ul>
              {user?.otherUsers?.length > 0 ? (
                user?.otherUsers?.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center justify-between mb-4"
                  >
                    <div className="flex items-center">
                      <img
                        src={
                          user?.profilePicture ||
                          "https://pbs.twimg.com/profile_images/1750178437351047168/EBouSx8G_400x400.jpg"
                        } // Fallback image
                        alt="Profile"
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                          {user?.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {user?.userName}
                        </p>
                      </div>
                    </div>
                    <Link to={`profile/${user?._id}`}>
                      <button className="bg-black dark:bg-gray-700 py-1 text-sm text-white dark:text-gray-300 px-4 rounded-2xl">
                        Profile
                      </button>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-600 dark:text-gray-400 text-center">
                  No users found.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
