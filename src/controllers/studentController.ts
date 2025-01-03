import { Request, Response } from "express";
import { StudentService } from "../services/studentService";
import { Types } from "mongoose";

const studentService = new StudentService();

export class StudentController {

  async searchStudents(req: any, res: any) {
    try {
      const { term } = req.query;
      if (!term || typeof term !== "string") {
        return res
          .status(400)
          .json({ message: "Invalid or missing search term." });
      }

      const results = await studentService.searchStudents(term);
      res.status(200).json({
        message: "Search results fetched successfully.",
        data: results,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error." });
    }
  }

  async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const query = (req.query.search as string) || "";
      const students = await studentService.getStudents(query);
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

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid student ID." });
        return;
      }

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

  async editStudents(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { age } = req.body;

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid student ID." });
        return;
      }

      const students = await studentService.editStudents(
        new Types.ObjectId(id),
        age
      );
      res.status(200).json({ students });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  async deleteStudents(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid student ID." });
        return;
      }

      const students = await studentService.deleteStudents(
        new Types.ObjectId(id)
      );
      res.status(200).json({ students });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  async getStudentCourses(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const courses = await studentService.getStudentCourses(id);

      res.status(200).json(courses);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  async updateStudentCourses(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { coursesselected } = req.body;

      const updatedStudent = await studentService.updateStudentCourses(
        id,
        coursesselected
      );

      res.status(200).json(updatedStudent);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }
}
