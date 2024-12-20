import express from 'express';
import { StudentController } from '../controllers/studentController';


const router = express.Router();
const studentController = new StudentController();

router.post('/', studentController.createStudent);
router.get('/search', studentController.searchStudents);
router.get('/', studentController.getStudents);
router.get("/:id", studentController.getStudentDetails);
router.put("/:id", studentController.editStudents);
router.delete("/:id", studentController.deleteStudents);
router.post("/courses/:id", studentController.updateStudentCourses);
router.get("/courses/:id", studentController.getStudentCourses);

export default router;
