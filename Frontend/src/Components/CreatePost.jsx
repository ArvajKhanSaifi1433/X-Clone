import React, { useState } from "react";
import { FaImage } from "react-icons/fa";
import { useLocalStorage } from "../Hooks/useLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { getIsActive, getRefresh } from "../Redux/Slices/tweetSlice";
import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";

function CreatePost() {
  // const [text, setText] = useState(""); // State for textarea content
  const [text, setText] = useLocalStorage("text", "");

  const [selectedFile, setSelectedFile] = useState(null); // State for file

  const { activeTab } = useSelector((store) => store.tweet);
  // console.log(activeTab,refresh);

  const dispatch = useDispatch();

  // Handle textarea input change
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        `${TWEET_API_END_POINT}/createTweet`,
        {
          description: text,
        },
        { withCredentials: true }
      );
      dispatch(getRefresh());
      console.log(data);
      setText("");
      setSelectedFile(null);
      if (data?.success) {
        toast.success(data?.message);
      }
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-[99] dark:bg-gray-800 bg-white">
        <div className="flex justify-around items-center border-b dark:border-gray-700">
          <div
            className={`cursor-pointer flex-1 text-center py-2 ${
              activeTab === true
                ? "border-b-4 border-b-sky-400 text-sky-400 dark:border-b-sky-500 dark:text-sky-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => {
              dispatch(getIsActive(true));
              window.scrollTo(0, 0);
            }}
          >
            <h2 className="font-bold text-lg">For you</h2>
          </div>
          <div
            className={`cursor-pointer flex-1 text-center py-2 ${
              activeTab === false
                ? "border-b-4 border-b-sky-400 text-sky-400 dark:border-b-sky-500 dark:text-sky-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => {
              dispatch(getIsActive(false));

              window.scrollTo(0, 0);
            }}
          >
            <h2 className="font-bold text-lg">Following</h2>
          </div>
        </div>
      </div>
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center">
          <img
            src="https://pbs.twimg.com/profile_images/1750178437351047168/EBouSx8G_400x400.jpg"
            alt="arvaj_img"
            className="w-12 h-12 object-cover rounded-full border border-gray-300 dark:border-gray-600 self-start"
          />
          <form className="ml-2 flex-1" onSubmit={handleSubmit}>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="What's happening?!"
              className="w-full focus:outline-none rounded-lg p-2 resize-none placeholder:text-lg dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              rows="2"
            ></textarea>
            <div className="flex items-center mt-2 justify-between">
              <div className="mr-2">
                <input
                  type="file"
                  accept="image/*"
                  id="twitterimg"
                  hidden
                  onChange={handleFileChange}
                />
                <label htmlFor="twitterimg" className="cursor-pointer">
                  <FaImage
                    size={24}
                    className="text-gray-600 hover:text-sky-400 dark:text-gray-400 dark:hover:text-sky-500"
                  />
                </label>
              </div>
              <button
                type="submit"
                className={`px-5 py-1.5 bg-sky-400 hover:bg-sky-500 text-white rounded-full font-semibold ${
                  text ? "" : "opacity-50 pointer-events-none"
                } dark:bg-sky-500 dark:hover:bg-sky-600`}
              >
                Post
              </button>
            </div>
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                className="w-full h-[200px] my-2 rounded-lg dark:bg-gray-800"
                alt=""
              />
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
