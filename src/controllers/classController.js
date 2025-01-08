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
exports.ClassController = void 0;
const classService_1 = require("../services/classService");
const classService = new classService_1.ClassService();
class ClassController {
    createClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { class_name, courses } = req.body;
                if (!class_name || typeof class_name !== 'string') {
                    res.status(400).json({ message: 'Invalid class name.' });
                    return;
                }
                if (!Array.isArray(courses) || !courses.every(c => typeof c === 'string')) {
                    res.status(400).json({ message: 'Invalid courses. Must be an array of strings.' });
                    return;
                }
                const createdClass = yield classService.createClass(class_name, courses);
                res.status(201).json({ message: 'Class created successfully.', data: createdClass });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        });
    }
    getClasses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classes = yield classService.getClass();
                res.status(200).json({ message: 'Classes fetched successfully.', data: classes });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        });
    }
    getClassesOnly(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classes = yield classService.getClasses();
                res.status(200).json({ message: 'Classes fetched successfully.', data: classes });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        });
    }
}
exports.ClassController = ClassController;
