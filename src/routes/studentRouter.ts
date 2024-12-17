// course.routes.ts
import express from 'express';
import { StudentController } from '../controllers/studentController';


const router = express.Router();
const studentController = new StudentController();

router.post('/', studentController.createStudent);
router.get('/', studentController.getStudents);
router.get("/:id", studentController.getStudentDetails);

export default router;
