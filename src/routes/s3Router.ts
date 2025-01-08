import { Router } from "express";
import multer from "multer";
import { S3Controller } from "../controllers/s3Controller";

const router = Router();
const upload = multer({ dest: "uploads/" }); // Multer config for file uploads
const s3Controller = new S3Controller();

router.post("/upload", upload.single("file"), (req, res) => s3Controller.uploadFile(req, res));

export default router;
