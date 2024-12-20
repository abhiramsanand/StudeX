import express from 'express';
import { CourseController } from '../controllers/courseController';

const router = express.Router();
const courseController = new CourseController();

router.post('/', courseController.createCourse);
router.get('/', courseController.getCourses);

export default router;
