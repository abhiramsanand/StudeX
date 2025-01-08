"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const students_1 = require("../models/students");
const classes_1 = require("../models/classes");
const admins_1 = require("../models/admins");
const sendEmails_1 = require("../config/sendEmails");
class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
        this.JWT_EXPIRES_IN = "24h";
    }
    registerStudent(studentName_1, age_1, className_1, email_1, password_1) {
        return __awaiter(this, arguments, void 0, function* (studentName, age, className, email, password, role = "user") {
            const existingUser = yield students_1.Students.findOne({ email });
            if (existingUser) {
                throw new Error("Email already registered");
            }
            const existingClass = yield classes_1.Classes.findOne({
                class_name: className,
            }).populate("courses");
            if (!existingClass) {
                throw new Error("Class not found.");
            }
            const courseNames = existingClass.courses.map((course) => course.course_name);
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newStudent = new students_1.Students({
                student_name: studentName,
                age,
                class: existingClass._id,
                email,
                password: hashedPassword,
                role,
            });
            const createdStudent = yield newStudent.save();
            yield (0, sendEmails_1.classAssigned)(studentName, email, className, courseNames);
            return createdStudent;
        });
    }
    registerAdmin(adminName, email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield admins_1.Admins.findOne({ email });
            if (existingUser) {
                throw new Error("Email already registered");
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newAdmin = new admins_1.Admins({
                admin_name: adminName,
                email,
                password: hashedPassword,
                role,
            });
            const createdAdmin = yield newAdmin.save();
            return createdAdmin;
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield students_1.Students.findOne({ email });
            const admin = yield admins_1.Admins.findOne({ email });
            if (!user && !admin) {
                throw new Error("Invalid email or user not found");
            }
            const isMatch = user && (yield bcrypt_1.default.compare(password, user.password));
            const isAdminMatch = admin && (yield bcrypt_1.default.compare(password, admin.password));
            if (!isMatch && !isAdminMatch) {
                throw new Error("Invalid password");
            }
            const loggedInUser = isMatch ? user : admin;
            const role = isMatch ? "student" : "admin";
            const token = this.generateToken(loggedInUser, role);
            return { token, user: loggedInUser, role };
        });
    }
    generateToken(user, role) {
        return jsonwebtoken_1.default.sign({
            userId: user._id,
            email: user.email,
            role,
        }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    }
}
exports.AuthService = AuthService;
