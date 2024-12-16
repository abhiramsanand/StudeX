import { Schema } from 'mongoose';
import { Classes, IClasses } from '../models/classes';
import { Courses } from '../models/courses';

export class ClassService {
    /**
     * Create a class with course references.
     * @param className - Name of the class.
     * @param courseNames - Array of course names.
     * @returns The created class object.
     */
    async createClass(className: string, courseNames: string[]): Promise<IClasses> {
        const existingClass = await Classes.findOne({ class_name: className });
        if (existingClass) {
            throw new Error('Class already exists.');
        }

        // Find the ObjectIds for the provided course names
        const courses = await Courses.find({ course_name: { $in: courseNames } });
        if (courses.length !== courseNames.length) {
            throw new Error('Some course names do not exist.');
        }

        // Extract ObjectIds from the matched courses
        const courseIds = courses.map(course => course._id);

        // Create the class
        const newClass = new Classes({ class_name: className, courses: courseIds });
        return await newClass.save();
    }
}
