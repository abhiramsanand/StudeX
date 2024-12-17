import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import courseRouter from './routes/courseRouter'
import classRouter from './routes/classRouter'
import studentRouter from './routes/studentRouter'

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use('/api/courses', courseRouter);
app.use('/api/classes', classRouter);
app.use('/api/students', studentRouter);

export default app;
