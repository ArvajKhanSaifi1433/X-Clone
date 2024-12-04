import axios from "axios";
import { useEffect } from "react";
import { TWEET_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../Redux/Slices/tweetSlice";

function useGetMyTweets() {
  const dispatch = useDispatch();
  const { activeTab, refresh } = useSelector((store) => store.tweet);
  // console.log(activeTab, refresh);

  const allFollowingAndMyTweets = async () => {
    try {
      const { data } = await axios.get(`${TWEET_API_END_POINT}/getAllTweet`, {
        withCredentials: true,
      });
      // console.log(data);
      dispatch(getAllTweets(data?.data));
    } catch (error) {
      console.error(error); // Handle the error here
    }
  };

  const followingTweets = async () => {
    try {
      const { data } = await axios.get(
        `${TWEET_API_END_POINT}/getFollowingTweets`,
        {
          withCredentials: true,
        }
      );
      // console.log(data);
      dispatch(getAllTweets(data?.data));
    } catch (error) {
      console.error(error); // Handle the error here
    }
  };

  useEffect(() => {
    if (activeTab) {
      allFollowingAndMyTweets();
    } else {
      followingTweets();
    }
  }, [activeTab,refresh]);
}

export default useGetMyTweets;
