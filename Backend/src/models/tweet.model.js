import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "Tweet description is required"],
      trim: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"], // Ensure user ID is provided
    },
    userDetails: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, minimize: false }
);

const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", tweetSchema);

export default Tweet;
