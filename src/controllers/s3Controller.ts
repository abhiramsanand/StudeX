import { Request, Response } from "express";
import { S3Service } from "../services/s3Service";

const s3Service = new S3Service();

export class S3Controller {
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      const { bucketName, key } = req.body;

      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      console.log("Uploaded file:", req.file);  // Log the uploaded file details

      const filePath = req.file.path; // File path from multer
      const response = await s3Service.uploadFile(bucketName, key, filePath);

      res.status(200).json({ message: response });
    } catch (error: any) {
      console.error("Error during upload:", error);
      res.status(500).json({ error: error.message });
    }
  }
}
