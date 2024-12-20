import { Schema } from "mongoose";
import { Classes, IClasses } from "../models/classes";
import { Courses } from "../models/courses";

export class ClassService {
  async createClass(
    className: string,
    courseNames: string[]
  ): Promise<IClasses> {
    const existingClass = await Classes.findOne({ class_name: className });
    if (existingClass) {
      throw new Error("Class already exists.");
    }

    const courses = await Courses.find({ course_name: { $in: courseNames } });
    if (courses.length !== courseNames.length) {
      throw new Error("Some course names do not exist.");
    }

    let totalCredits = 0;

    for (let i = 0; i < courses.length; i++) {
      totalCredits += courses[i].credit || 0; 
    }

    if (totalCredits > 12) {
      throw new Error(
        `Total course credits (${totalCredits}) exceed the maximum allowed limit of 12.`
      );
    }

    if (totalCredits < 10) {
      throw new Error(
        `Total course credits (${totalCredits}) does not meet the required limit of 10.`
      );
    }

    const courseIds = courses.map((course) => course._id);

    const newClass = new Classes({ class_name: className, courses: courseIds });
    return await newClass.save();
  }

  async getClass(): Promise<IClasses[]> {
    const classes = await Classes.find().populate({
      path: "courses",
      select: "course_name -_id",
    });
    return classes;
  }

  async getClasses(): Promise<IClasses[]> {
    const classes = await Classes.find({}, "class_name -_id");
    return classes;
  }
}
