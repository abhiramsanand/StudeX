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
exports.StudentService = void 0;
const students_1 = require("../models/students");
const classes_1 = require("../models/classes");
const mongoose_1 = __importDefault(require("mongoose"));
const courses_1 = require("../models/courses");
class StudentService {
    searchStudents(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield students_1.Students.aggregate([
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
            }
            catch (err) {
                console.error("Error executing search:", err);
                throw err;
            }
        });
    }
    getStudents() {
        return __awaiter(this, arguments, void 0, function* (query = "") {
            const searchRegex = new RegExp(query, "i");
            const students = yield students_1.Students.find({ student_name: { $regex: searchRegex } }, "student_name age");
            return students;
        });
    }
    getStudentDetails(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentDetails = yield students_1.Students.findById(studentId, "student_name coursesselected")
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
        });
    }
    editStudents(studentId, age) {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield students_1.Students.findByIdAndUpdate(studentId, { $set: { age } }, { new: true, upsert: true });
            return students;
        });
    }
    deleteStudents(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield students_1.Students.findByIdAndDelete(studentId);
            return students;
        });
    }
    getStudentCourses(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield students_1.Students.findById(studentId).populate("class");
            if (!student) {
                throw new Error("Student not found.");
            }
            const studentClass = yield classes_1.Classes.findById(student.class).populate("courses");
            if (!studentClass) {
                throw new Error("Class not found.");
            }
            return studentClass.courses;
        });
    }
    updateStudentCourses(studentId, courseIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValid = courseIds.every((id) => mongoose_1.default.Types.ObjectId.isValid(id));
            if (!isValid) {
                throw new Error("One or more course IDs are invalid.");
            }
            const student = yield students_1.Students.findById(studentId).populate("class");
            if (!student) {
                throw new Error("Student not found.");
            }
            const studentClass = yield classes_1.Classes.findById(student.class).populate("courses");
            if (!studentClass) {
                throw new Error("Class not found.");
            }
            const classCourseIds = studentClass.courses.map((course) => course._id.toString());
            const areCoursesValid = courseIds.every((id) => classCourseIds.includes(id.toString()));
            if (!areCoursesValid) {
                throw new Error("Selected courses are not part of the assigned class courses.");
            }
            const courses = yield courses_1.Courses.find({ _id: { $in: courseIds } });
            let totalCredits = 0;
            for (let i = 0; i < courses.length; i++) {
                totalCredits += courses[i].credit || 0;
            }
            if (totalCredits < 6 || totalCredits > 7) {
                throw new Error("Total credits of selected courses must be between 6 and 7.");
            }
            return yield students_1.Students.findByIdAndUpdate(studentId, { coursesselected: courseIds }, { new: true });
        });
    }
}
exports.StudentService = StudentService;
