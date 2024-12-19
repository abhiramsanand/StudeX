import { Students } from "../models/students";
import { Classes } from "../models/classes";
import mongoose, { Types } from "mongoose";
import { Courses } from "../models/courses";

export class StudentService {
  async createStudent(studentName: string, age: number, className: string) {
    const existingClass = await Classes.findOne({ class_name: className });
    if (!existingClass) {
      throw new Error("Class not found.");
    }

    const newStudent = new Students({
      student_name: studentName,
      age: age,
      class: existingClass._id,
    });

    return await newStudent.save();
  }

  async searchStudents(searchTerm: any) {
    try {
      const results = await Students.aggregate([
        {
          $search: {
            index: "default",
            text: {
              query: searchTerm,
              path: "student_name",
            },
          },
        },
        { $limit: 10 },
      ]);
      return results;
    } catch (err) {
      console.error("Error executing search:", err);
      throw err;
    }
  }

  async getStudents() {
    const students = await Students.find({}, "student_name age");
    return students;
  }

  async getStudentDetails(studentId: Types.ObjectId) {
    const studentDetails = await Students.findById(
      studentId,
      "student_name"
    ).populate({
      path: "class",
      select: "class_name -_id",
      populate: {
        path: "courses",
        select: "course_name -_id",
      },
    });

    if (!studentDetails) {
      throw new Error("Student not found.");
    }

    return studentDetails;
  }

  async editStudents(studentId: Types.ObjectId, age: number) {
    const students = await Students.findByIdAndUpdate(
      studentId,
      { $set: { age } },
      { new: true, upsert: true }
    );
    return students;
  }

  async deleteStudents(studentId: Types.ObjectId) {
    const students = await Students.findByIdAndDelete(studentId);
    return students;
  }
}
