import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const verifyJWT = async (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies?.accessToken;

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json(new ApiError(401, "Unauthorized request: No token provided"));
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    /*  decodedToken ==> {
        _id: '66ce84687b65e75eaa24711c',
        name: 'arvaj',
        userName: '@arvaj_saifi',
        email: 'arvajkhan91@gmail.com',
        iat: 1724982329,
        exp: 1725068729
      } */

    // Find user by decoded token ID
    const user = await User.findById(decodedToken._id).select("-password");

    // Check if user exists
    if (!user) {
      return res
        .status(401)
        .json(new ApiError(401, "Unauthorized request: User not found"));
    }

    // Attach user to request object
    req.user = user;

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json(new ApiError(401, "Token has expired, please regenerate token"));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(new ApiError(401, "Invalid token"));
    }

    // Handle other errors
    return res
      .status(error.status || 500)
      .json(
        new ApiError(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

export { verifyJWT };
