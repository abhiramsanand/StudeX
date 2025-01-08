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
exports.scheduledTask1 = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const students_1 = require("../models/students");
const sendEmails_1 = require("./sendEmails");
const scheduledTask1 = () => {
    node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const studentsWithoutCourses = yield students_1.Students.find({ coursesselected: { $size: 0 } }, "email student_name -_id");
            if (studentsWithoutCourses.length > 0) {
                for (const student of studentsWithoutCourses) {
                    const studentName = student.student_name;
                    const studentEmail = student.email;
                    yield (0, sendEmails_1.noCourses)(studentName, studentEmail);
                }
            }
            else {
                console.log("No students found without selected courses.");
            }
        }
        catch (error) {
            console.error("Error fetching students without courses:", error);
        }
    }));
};
exports.scheduledTask1 = scheduledTask1;
