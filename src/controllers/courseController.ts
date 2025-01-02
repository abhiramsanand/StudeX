import { Request, Response } from 'express';
import { CourseService } from '../services/courseService';
import { courseEvents } from '../models/courses';

const courseService = new CourseService();

export class CourseController {
    constructor() {
        courseEvents.on('courseCreated', (course) => {
            console.log(`[Controller] Event received: New course created - ${course.course_name}`);
        });
    }

    async createCourse(req: Request, res: Response): Promise<void> {
        try {
            const { course_name, credit } = req.body;

            if (!course_name || typeof course_name !== 'string') {
                res.status(400).json({ message: 'Invalid course name.' });
                return;
            }

            const course = await courseService.createCourse(course_name, credit);

            res.status(201).json({ message: 'Course created successfully.', data: course });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }

    async getCourses(req: Request, res: Response): Promise<void> {
        try {
            const courses = await courseService.getCourses();
            res.status(200).json({ message: 'Courses fetched successfully.', data: courses });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
}
