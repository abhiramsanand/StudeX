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
exports.CourseService = void 0;
const courses_1 = require("../models/courses");
class CourseService {
    createCourse(courseName, credit) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCourse = yield courses_1.Courses.findOne({ course_name: courseName });
            if (existingCourse) {
                throw new Error('Course already exists.');
            }
            const newCourse = new courses_1.Courses({ course_name: courseName, credit: credit });
            const savedCourse = newCourse.save();
            courses_1.courseEvents.emit('courseCreated', savedCourse);
            return savedCourse;
        });
    }
    getCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            const classes = yield courses_1.Courses.find({}, "course_name credit -_id");
            return classes;
        });
    }
}
exports.CourseService = CourseService;
