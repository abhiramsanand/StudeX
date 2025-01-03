import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Students, IStudents } from "../models/students";
import { Classes } from "../models/classes";
import { Courses } from "../models/courses";
import { emailConfig } from "../config/emailConfig";

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    this.JWT_EXPIRES_IN = "24h";
  }

  async registerStudent(
    studentName: string,
    age: number,
    className: string,
    email: string,
    password: string,
    role: "admin" | "user" = "user"
  ): Promise<IStudents> {
    const existingUser = await Students.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const existingClass = await Classes.findOne({
      class_name: className,
    }).populate("courses");
    if (!existingClass) {
      throw new Error("Class not found.");
    }

    const courseNames = existingClass.courses.map(
      (course: any) => course.course_name
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Students({
      student_name: studentName,
      age,
      class: existingClass._id,
      email,
      password: hashedPassword,
      role,
    });

    const createdStudent = await newStudent.save();
    await emailConfig(studentName, email, className, courseNames);
    return createdStudent;
  }

  async loginStudent(
    email: string,
    password: string
  ): Promise<{ token: string; user: IStudents }> {
    const user = await Students.findOne({ email });
    if (!user) {
      throw new Error("Invalid email");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = this.generateToken(user);
    return { token, user };
  }

  private generateToken(user: IStudents): string {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }
}
