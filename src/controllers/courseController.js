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
exports.CourseController = void 0;
const courseService_1 = require("../services/courseService");
const courses_1 = require("../models/courses");
const courseService = new courseService_1.CourseService();
class CourseController {
    constructor() {
        courses_1.courseEvents.on('courseCreated', (course) => {
            console.log(`[Controller] Event received: New course created - ${course.course_name}`);
        });
    }
    createCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { course_name, credit } = req.body;
                if (!course_name || typeof course_name !== 'string') {
                    res.status(400).json({ message: 'Invalid course name.' });
                    return;
                }
                const course = yield courseService.createCourse(course_name, credit);
                res.status(201).json({ message: 'Course created successfully.', data: course });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        });
    }
    getCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield courseService.getCourses();
                res.status(200).json({ message: 'Courses fetched successfully.', data: courses });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        });
    }
}
exports.CourseController = CourseController;
