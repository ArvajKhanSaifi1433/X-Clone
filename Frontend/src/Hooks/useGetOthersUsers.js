import axios from "axios";
import { useEffect } from "react";
import { USER_API_END_POINT } from "../utils/constant";
import { useDispatch } from "react-redux";
import { getOtherUsers } from "../Redux/Slices/UserSlice";

function useGetOthersUsers() {
  const dispatch = useDispatch();
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(
          `${USER_API_END_POINT}/otherUser`,
          { withCredentials: true }
        );
        dispatch(getOtherUsers(data?.data));
        // console.log(data); // Handle the profile data here
      } catch (error) { 
        console.error(error); // Handle the error here
      }
    })();
  }, []);
}

export default useGetOthersUsers;
