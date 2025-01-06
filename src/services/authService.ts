import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Students, IStudents } from "../models/students";
import { Classes } from "../models/classes";
import { emailConfig } from "../config/emailConfig";
import { Admins, IAdmins } from "../models/admins";

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

  async registerAdmin(
    adminName: string,
    email: string,
    password: string,
    role: "admin"
  ): Promise<IAdmins> {
    const existingUser = await Admins.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admins({
      admin_name: adminName,
      email,
      password: hashedPassword,
      role,
    });

    const createdAdmin = await newAdmin.save();
    return createdAdmin;
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ token: string; user: any; role: string }> {
    const user = await Students.findOne({ email });
    const admin = await Admins.findOne({ email });
  
    if (!user && !admin) {
      throw new Error("Invalid email or user not found");
    }
  
    const isMatch =
      user && (await bcrypt.compare(password, user.password));
    const isAdminMatch =
      admin && (await bcrypt.compare(password, admin.password));
  
    if (!isMatch && !isAdminMatch) {
      throw new Error("Invalid password");
    }
  
    const loggedInUser = isMatch ? user : admin;
    const role = isMatch ? "student" : "admin";
  
    const token = this.generateToken(loggedInUser, role);
  
    return { token, user: loggedInUser, role };
  }
  
  private generateToken(user: any, role: string): string {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role,
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }  
}
