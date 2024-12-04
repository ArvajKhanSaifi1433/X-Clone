import React, { useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useGetProfile from "../Hooks/useGetProfile";
import { USER_API_END_POINT } from "../utils/constant";
import axios from "axios";
import toast from "react-hot-toast";
import { toggleFollow } from "../Redux/Slices/UserSlice";

function Profile() {
  const { id } = useParams();
  const { user, profile } = useSelector((select) => select.user);
  useGetProfile(id);
  const dispatch = useDispatch();

  const followUnfollow = async (id, key) => {
    try {
      const { data } = await axios.post(
        `${USER_API_END_POINT}/${key}/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      // console.log(data);
      if (data.success) {
        toast.success(data?.message);
      }

      dispatch(toggleFollow(id));
    } catch (error) {
      console.error(error); // Handle the error here
    }
  };
  return (
    <div className="border  w-full bg-white dark:bg-gray-900 pb-8 dark:border-gray-700 min-h-screen">
      <div className="inline-flex items-center gap-5 ps-5 py-1 dark:bg-gray-900  dark:text-white">
        <div
          className="text-2xl dark:text-gray-300 cursor-pointer"
          onClick={() => history.back()}
        >
          <FaArrowLeftLong size={15} />
        </div>
        <div>
          <p className="text-xl font-semibold dark:text-gray-200">
            {profile?.name}
          </p>
          <p className="text-sm font-light dark:text-gray-400">5 Post</p>
        </div>
      </div>

      <div>
        <div className="h-[220px] relative">
          <img
            src="https://pbs.twimg.com/profile_banners/1750174379202490368/1706110357/1080x360"
            alt=""
            className="w-full h-full object-fill"
          />

          <div className="size-32 rounded-full absolute -bottom-16 left-4">
            <img
              src="https://pbs.twimg.com/profile_images/1750178437351047168/EBouSx8G_400x400.jpg"
              alt=""
              className="rounded-full w-full h-full object-cover border-2 dark:border-black border-white"
            />
            <div>
              <p className="font-bold text-gray-800 dark:text-white text-xl">
                {profile?.name}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-[15px]">
                {profile?.userName}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end me-5 mt-4 flex-col ">
        {profile?._id === user?._id ? (
          <button className="px-6 self-end py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-black dark:text-white border border-black dark:border-gray-600">
            Edit Profile
          </button>
        ) : user?.following?.includes(profile?._id) ? (
          <button
            className="px-6 self-end py-1.5 hover:bg-gray-200 dark:hover:bg-white/70 rounded-full dark:bg-white text-black dark:text-black border border-black dark:border-gray-600 font-medium"
            onClick={() => {
              followUnfollow(profile?._id, "unfollow");
            }}
          >
            Unfollow
          </button>
        ) : (
          <button
            className="px-6 self-end py-1.5 hover:bg-gray-200 dark:hover:bg-white/70 rounded-full dark:bg-white text-black dark:text-black border border-black dark:border-gray-600 font-medium"
            onClick={() => {
              followUnfollow(profile?._id, "follow");
            }}
          >
            Follow
          </button>
        )}

        <p className="mt-[68px] ml-4 text-gray-700 dark:text-gray-300">
          I'm MERN stack developer 🚀 | BCA student 📚 | Passionate about
          crafting efficient and innovative web solutions 💻
        </p>

        <div className="ml-4 flex gap-10 mt-3 font-semibold text-gray-800 dark:text-gray-300">
          <p>
            {profile?.following?.length}{" "}
            <span className="text-gray-500">Following</span>
          </p>
          <p>
            {profile?.followers?.length}{" "}
            <span className="text-gray-500">Followers</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
