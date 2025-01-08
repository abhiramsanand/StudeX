import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import courseRouter from "./routes/courseRouter";
import classRouter from "./routes/classRouter";
import studentRouter from "./routes/studentRouter";
import messagesRouter from "./routes/messagesRouter";
import authRouter from "./routes/authRouter";
import { authenticateToken } from "./middlewares/authMiddleware";
import s3Routes from "./routes/s3Router";
import { scheduledTask1 } from "./config/scheduledTasks";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/courses", authenticateToken, courseRouter);
app.use("/api/classes", authenticateToken, classRouter);
app.use("/api/students", authenticateToken, studentRouter);
app.use("/api/messages", authenticateToken, messagesRouter);
app.use("/api/s3", s3Routes);

// scheduledTask1();

export default app;
