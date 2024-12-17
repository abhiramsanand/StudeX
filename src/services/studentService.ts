import { Students } from "../models/students";
import { Classes } from "../models/classes";
import { Types } from "mongoose";

export class StudentService {
  /**
   * Create a new student and associate them with a class.
   * @param studentName - Name of the student.
   * @param age - Age of the student.
   * @param className - Class name to associate with the student.
   * @returns Created student object.
   */
  async createStudent(studentName: string, age: number, className: string) {
    // Find the class by its name
    const existingClass = await Classes.findOne({ class_name: className });
    if (!existingClass) {
      throw new Error("Class not found.");
    }

    const newStudent = new Students({
      student_name: studentName,
      age: age,
      class: existingClass._id, // Use the ObjectId from the Classes collection
    });

    return await newStudent.save();
  }

  async getStudents() {
    const students = await Students.find({}, "student_name age");
    return students;
  }

  async getStudentDetails(studentId: Types.ObjectId) {
    const studentDetails = await Students.findById(studentId, "student_name")
      .populate({
        path: "class", // Populate class details
        select: "class_name -_id",
        populate: {
          path: "courses", // Populate courses within the class
          select: "course_name -_id",
        },
      });

    if (!studentDetails) {
      throw new Error("Student not found.");
    }

    return studentDetails;
  }

  async editStudents(studentId: Types.ObjectId, age: number) {
    const students = await Students.findByIdAndUpdate(studentId, {$set: {age}}, { new: true, upsert: true });
    return students;
  }

  async deleteStudents(studentId: Types.ObjectId) {
    const students = await Students.findByIdAndDelete(studentId);
    return students;
  }
}
