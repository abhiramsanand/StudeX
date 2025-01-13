import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import csvParser from "csv-parser";
import * as XLSX from "xlsx";
import { bulkCreateCourses } from "../services/fileUploadService";

const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage }).single('file');

const uploadCoursesFile = async (req: Request, res: Response): Promise<void> => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: 'Error in file upload', error: err.message });
        return;
      }

      const filePath = path.join(uploadDir, req.file?.filename || '');
      const fileExtension = path.extname(req.file?.originalname || '').toLowerCase();

      let data = [];
      if (fileExtension === '.csv') {
        data = await parseCSV(filePath);
      } else if (fileExtension === '.xlsx') {
        data = await parseExcel(filePath);
      } else {
        res.status(400).json({ message: 'Unsupported file type' });
        return;
      }

      const result = await bulkCreateCourses(data);

      fs.unlinkSync(filePath);

      res.status(201).json({ message: 'Courses uploaded successfully', data: result });
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

const parseCSV = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

const parseExcel = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      resolve(jsonData);
    } catch (err) {
      reject(err);
    }
  });
};

export default { uploadCoursesFile };
