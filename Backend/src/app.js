import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use(express.static("./public"));

app.use(cookieParser());

// routes declation
import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/tweet", tweetRouter);

export { app };
