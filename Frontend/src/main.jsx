import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home.jsx";
import Profile from "./Components/Profile.jsx";
import Login from "./Components/Login.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./Redux/index.js"; // Import both store and persistor
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate

// Set up the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "profile/:id",
        element: <Profile name="Home" />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

// Render the application
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {" "}
      {/* Use PersistGate */}
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
