import { Request, Response } from "express";
import { StudentService } from "../services/studentService";
import { Types } from "mongoose";

const studentService = new StudentService();

export class StudentController {
  async createStudent(req: Request, res: Response): Promise<void> {
    try {
      const { student_name, age, class_name } = req.body;

      // Validate input
      if (!student_name || typeof student_name !== "string") {
        res.status(400).json({ message: "Invalid student name." });
        return;
      }

      if (!age || typeof age !== "number" || age <= 0) {
        res.status(400).json({ message: "Invalid age." });
        return;
      }

      if (!class_name || typeof class_name !== "string") {
        res.status(400).json({ message: "Invalid class name." });
        return;
      }

      // Call the service to create the student
      const createdStudent = await studentService.createStudent(
        student_name,
        age,
        class_name
      );

      res.status(201).json({
        message: "Student created successfully.",
        data: createdStudent,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const students = await studentService.getStudents();
      res.status(200).json({ students });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  async getStudentDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validate the ID
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid student ID." });
        return;
      }

      // Fetch student details
      const studentDetails = await studentService.getStudentDetails(
        new Types.ObjectId(id)
      );

      res.status(200).json({ data: studentDetails });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }
}
