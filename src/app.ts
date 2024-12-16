import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import courseRouter from './routes/courseRouter'


dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use('/api/courses', courseRouter);

export default app;
