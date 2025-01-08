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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const studentService_1 = require("../services/studentService");
const mongoose_1 = require("mongoose");
const studentService = new studentService_1.StudentService();
class StudentController {
    searchStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { term } = req.query;
                if (!term || typeof term !== "string") {
                    return res
                        .status(400)
                        .json({ message: "Invalid or missing search term." });
                }
                const results = yield studentService.searchStudents(term);
                res.status(200).json({
                    message: "Search results fetched successfully.",
                    data: results,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error." });
            }
        });
    }
    getStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query.search || "";
                const students = yield studentService.getStudents(query);
                res.status(200).json({ students });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
        });
    }
    getStudentDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    res.status(400).json({ message: "Invalid student ID." });
                    return;
                }
                const studentDetails = yield studentService.getStudentDetails(new mongoose_1.Types.ObjectId(id));
                res.status(200).json({ data: studentDetails });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
        });
    }
    editStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { age } = req.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    res.status(400).json({ message: "Invalid student ID." });
                    return;
                }
                const students = yield studentService.editStudents(new mongoose_1.Types.ObjectId(id), age);
                res.status(200).json({ students });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
        });
    }
    deleteStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    res.status(400).json({ message: "Invalid student ID." });
                    return;
                }
                const students = yield studentService.deleteStudents(new mongoose_1.Types.ObjectId(id));
                res.status(200).json({ students });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
        });
    }
    getStudentCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const courses = yield studentService.getStudentCourses(id);
                res.status(200).json(courses);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
        });
    }
    updateStudentCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { coursesselected } = req.body;
                const updatedStudent = yield studentService.updateStudentCourses(id, coursesselected);
                res.status(200).json(updatedStudent);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
        });
    }
}
exports.StudentController = StudentController;
