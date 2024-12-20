import { Request, Response } from 'express';
import { ClassService } from '../services/classService';

const classService = new ClassService();

export class ClassController {
    async createClass(req: Request, res: Response): Promise<void> {
        try {
            const { class_name, courses } = req.body;

            // Validate input
            if (!class_name || typeof class_name !== 'string') {
                res.status(400).json({ message: 'Invalid class name.' });
                return;
            }

            if (!Array.isArray(courses) || !courses.every(c => typeof c === 'string')) {
                res.status(400).json({ message: 'Invalid courses. Must be an array of strings.' });
                return;
            }

            // Call the service to create the class
            const createdClass = await classService.createClass(class_name, courses);

            res.status(201).json({ message: 'Class created successfully.', data: createdClass });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }

    async getClasses(req: Request, res: Response): Promise<void> {
        try {
            const classes = await classService.getClass();
            res.status(200).json({ message: 'Classes fetched successfully.', data: classes });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }

    async getClassesOnly(req: Request, res: Response): Promise<void> {
        try {
            const classes = await classService.getClasses();
            res.status(200).json({ message: 'Classes fetched successfully.', data: classes });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
}
