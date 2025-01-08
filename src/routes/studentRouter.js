"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const router = express_1.default.Router();
const studentController = new studentController_1.StudentController();
router.get('/search', studentController.searchStudents);
router.get('/', studentController.getStudents);
router.get("/:id", studentController.getStudentDetails);
router.put("/:id", studentController.editStudents);
router.delete("/:id", studentController.deleteStudents);
router.post("/courses/:id", studentController.updateStudentCourses);
router.get("/courses/:id", studentController.getStudentCourses);
exports.default = router;
