import axios from "axios";
import { useEffect } from "react";
import { USER_API_END_POINT } from "../utils/constant";
import { useDispatch } from "react-redux";
import { getMyProfile } from "../Redux/Slices/UserSlice";

function useGetProfile(id) {
  const dispatch = useDispatch();
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(
          `${USER_API_END_POINT}/profile/${id}`,
          { withCredentials: true }
        );
        dispatch(getMyProfile(data?.data));
        // console.log(data); // Handle the profile data here
      } catch (error) {
        console.error(error); // Handle the error here
      }
    })();
  }, [id]);
}

export default useGetProfile;
