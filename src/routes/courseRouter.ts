// course.routes.ts
import express from 'express';
import { CourseController } from '../controllers/courseController';

const router = express.Router();
const courseController = new CourseController();

/**
 * @route POST /api/courses
 * @desc Create a new course
 * @access Public
 */
router.post('/', courseController.createCourse);

export default router;
