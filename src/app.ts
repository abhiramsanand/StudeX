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
import bodyParser from "body-parser";
import fileUploadRouter from './routes/fileUploadRouter';
import path from 'path';
import fs from 'fs';

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://studex-a79vgqm49-abhiramsanands-projects.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

app.use("/api/auth", authRouter);
app.use("/api/courses", authenticateToken, courseRouter);
app.use("/api/classes", authenticateToken, classRouter);
app.use("/api/students", authenticateToken, studentRouter);
app.use("/api/messages", authenticateToken, messagesRouter);
app.use("/api/fileupload", authenticateToken, fileUploadRouter);

export default app;
