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
exports.messageNew = exports.noCourses = exports.classAssigned = void 0;
const emailConfig_1 = require("./emailConfig");
const classAssigned = (studentName, email, className, courses) => __awaiter(void 0, void 0, void 0, function* () {
    const courseList = courses.join(", ");
    const message = `Hello ${studentName}, you have been assigned to the ${className} class. You can select courses and fill the credits from these courses: ${courseList}.`;
    yield (0, emailConfig_1.emailConfig)(email, "Class Assignment Notification", message);
});
exports.classAssigned = classAssigned;
const noCourses = (studentName, email) => __awaiter(void 0, void 0, void 0, function* () {
    const message = `Hello ${studentName}, you have not selected any of the courses to fill in your credits till now.`;
    yield (0, emailConfig_1.emailConfig)(email, "No Courses Selected", message);
});
exports.noCourses = noCourses;
const messageNew = (studentName, sender, email, content) => __awaiter(void 0, void 0, void 0, function* () {
    const message = `Hi ${studentName}, there is a new messge for you in StudeX. ${sender} says: "${content}"`;
    yield (0, emailConfig_1.emailConfig)(email, "New message in StudeX", message);
});
exports.messageNew = messageNew;
