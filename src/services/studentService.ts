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

  async getStudents(query: string = "") {
    const searchRegex = new RegExp(query, "i"); // Case-insensitive search
    const students = await Students.find(
      { student_name: { $regex: searchRegex } },
      "student_name age"
    );
    return students;
  }  

  async getStudentDetails(studentId: Types.ObjectId) {
    const studentDetails = await Students.findById(studentId, "student_name coursesselected")
      .populate({
        path: "class",
        select: "class_name -_id",
        populate: {
          path: "courses",
          select: "course_name -_id",
        },
      })
      .populate({
        path: "coursesselected",
        select: "course_name -_id",
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

  async getStudentCourses(studentId: string) {
    const student = await Students.findById(studentId).populate("class");
    if (!student) {
      throw new Error("Student not found.");
    }

    const studentClass = await Classes.findById(student.class).populate(
      "courses"
    );
    if (!studentClass) {
      throw new Error("Class not found.");
    }

    return studentClass.courses;
  }

  async updateStudentCourses(studentId: string, courseIds: Types.ObjectId[]) {
    const isValid = courseIds.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (!isValid) {
      throw new Error("One or more course IDs are invalid.");
    }

    const student = await Students.findById(studentId).populate("class");
    if (!student) {
      throw new Error("Student not found.");
    }

    const studentClass = await Classes.findById(student.class).populate(
      "courses"
    );
    if (!studentClass) {
      throw new Error("Class not found.");
    }

    const classCourseIds = studentClass.courses.map((course: any) =>
      course._id.toString()
    );

    const areCoursesValid = courseIds.every((id) =>
      classCourseIds.includes(id.toString())
    );
    if (!areCoursesValid) {
      throw new Error(
        "Selected courses are not part of the assigned class courses."
      );
    }

    const courses = await Courses.find({ _id: { $in: courseIds } });

    let totalCredits = 0;

    for (let i = 0; i < courses.length; i++) {
      totalCredits += courses[i].credit || 0;
    }

    if (totalCredits < 6 || totalCredits > 7) {
      throw new Error(
        "Total credits of selected courses must be between 6 and 7."
      );
    }

    return await Students.findByIdAndUpdate(
      studentId,
      { coursesselected: courseIds },
      { new: true }
    );
  }
}
