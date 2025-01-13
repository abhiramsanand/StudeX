import express from "express";
import fileUploadController from "../controllers/fileUploadController";

const router = express.Router();

router.post("/upload-courses", fileUploadController.uploadCoursesFile);

export default router;
