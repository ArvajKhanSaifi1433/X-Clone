import React, { useEffect } from "react";
import { FaTwitter } from "react-icons/fa";
import { useLocalStorage } from "../Hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUser } from "../Redux/Slices/UserSlice";

function Login() {
  const [isLogin, setIsLogin] = useLocalStorage("isLogin", "Login");
  const [formData, setFormData] = useLocalStorage("formData", {
    name: "",
    userName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const [isDarkMode, setIsDarkMode] = useLocalStorage("isDarkMode", false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin === "Login" ? "/login" : "/register";

    try {
      const { data } = await axios.post(
        `${USER_API_END_POINT}${endpoint}`,
        formData,
        { withCredentials: true }
        //withCredentials: true: Ensures that session cookies or authentication tokens are sent along with requests, which is necessary for authenticated sessions.
      );
      // console.log(data.data);
      dispatch(getUser(data?.data));

      if (data.success) {
        toast.success(data.message);
        if (endpoint === "/register") {
          setIsLogin("Login");
        } else {
          navigate("/");
        }
        // Reset form data only on successful login/registration
        setFormData({
          name: "",
          userName: "",
          email: "",
          password: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(message);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full border"
        >
          &larr; Back
        </button>
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg relative">
          <div className="flex items-center justify-center mb-6">
            <FaTwitter size={48} className="text-blue-500 dark:text-blue-300" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {isLogin === "Login" ? "Login to Twitter" : "Sign up for Twitter"}
          </h1>
          <form onSubmit={handleSubmit} autoComplete="off">
            {isLogin !== "Login" && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="userName"
                    className="block text-gray-700 dark:text-gray-300"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
                    required
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                minLength={5}
                maxLength={15}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isLogin === "Login" ? "Login" : "Sign up"}
            </button>
          </form>
          <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
            {isLogin === "Login" ? (
              <div>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsLogin("Sign Up")}
                  className="text-blue-500 dark:text-blue-300"
                >
                  Sign up
                </button>
              </div>
            ) : (
              <div>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin("Login")}
                  className="text-blue-500 dark:text-blue-300"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default Login;
