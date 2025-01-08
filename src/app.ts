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

export default app;