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
exports.ClassService = void 0;
const classes_1 = require("../models/classes");
const courses_1 = require("../models/courses");
class ClassService {
    createClass(className, courseNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingClass = yield classes_1.Classes.findOne({ class_name: className });
            if (existingClass) {
                throw new Error("Class already exists.");
            }
            const courses = yield courses_1.Courses.find({ course_name: { $in: courseNames } });
            if (courses.length !== courseNames.length) {
                throw new Error("Some course names do not exist.");
            }
            let totalCredits = 0;
            for (let i = 0; i < courses.length; i++) {
                totalCredits += courses[i].credit || 0;
            }
            if (totalCredits > 12) {
                throw new Error(`Total course credits (${totalCredits}) exceed the maximum allowed limit of 12.`);
            }
            if (totalCredits < 10) {
                throw new Error(`Total course credits (${totalCredits}) does not meet the required limit of 10.`);
            }
            const courseIds = courses.map((course) => course._id);
            const newClass = new classes_1.Classes({ class_name: className, courses: courseIds });
            return yield newClass.save();
        });
    }
    getClass() {
        return __awaiter(this, void 0, void 0, function* () {
            const classes = yield classes_1.Classes.find().populate({
                path: "courses",
                select: "course_name -_id",
            });
            return classes;
        });
    }
    getClasses() {
        return __awaiter(this, void 0, void 0, function* () {
            const classes = yield classes_1.Classes.find({}, "class_name -_id");
            return classes;
        });
    }
}
exports.ClassService = ClassService;
