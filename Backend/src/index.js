import dotenv from "dotenv";
import connectDB from "./db/Index.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((Error) => {
    console.log("MongoDB connection Field !! ", Error);
  });
