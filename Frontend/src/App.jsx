import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LeftSidebar from "./Components/LeftSidebar";
import RightSidebar from "./Components/RightSidebar";
import { useLocalStorage } from "./Hooks/useLocalStorage";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

function App() {
  const { user } = useSelector((select) => select.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  // const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useLocalStorage("isDarkMode", false);

  useEffect(() => {
    document.querySelector("body").classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleDarkModeToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="flex justify-between w-[85%] mx-auto bg-white dark:bg-gray-800 transition-colors duration-300">
          <LeftSidebar
            isDarkMode={isDarkMode}
            handleDarkModeToggle={handleDarkModeToggle}
          />
          <div className="w-[50%] bg-white dark:bg-gray-900 transition-colors duration-300">
            <Outlet />
          </div>
          <RightSidebar />
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
