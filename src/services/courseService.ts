import { Courses, ICourses } from '../models/courses';

export class CourseService {
    /**
     * Create a new course.
     * @param courseName - Name of the course to create.
     * @returns Created course object or throws an error.
     */
    async createCourse(courseName: string): Promise<ICourses> {
        // Check if the course already exists
        const existingCourse = await Courses.findOne({ course_name: courseName });
        if (existingCourse) {
            throw new Error('Course already exists.');
        }

        // Create the new course
        const newCourse = new Courses({ course_name: courseName });
        return await newCourse.save();
    }
}
