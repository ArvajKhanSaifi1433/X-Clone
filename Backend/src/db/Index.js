import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);

    console.log(
      `\nMongoDB connected successfully! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection Field Error ", error);
    process.exit(1);
  }
};

export default connectDB;
