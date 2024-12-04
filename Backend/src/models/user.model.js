import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists in the database"],
      trim: true,
      index: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists in the database"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        default: [],
      },
    ],
  },
  { timestamps: true, minimize: false }
);

userSchema.pre("save", async function (Next) {
  const user = this;

  if (!user.isModified("password")) {
    return Next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;

    Next();
  } catch (error) {
    return Next(error);
  }
});

userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    name: this.name,
    userName: this.userName,
    email: this.email,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

// Check if the model already exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
