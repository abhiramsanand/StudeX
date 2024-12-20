import { Courses, ICourses } from '../models/courses';

export class CourseService {
    async createCourse(courseName: string, credit: number): Promise<ICourses> {
        const existingCourse = await Courses.findOne({ course_name: courseName });
        if (existingCourse) {
            throw new Error('Course already exists.');
        }

        const newCourse = new Courses({ course_name: courseName, credit: credit });
        return await newCourse.save();
    }

    async getCourses(): Promise<ICourses[]> {
        const classes = await Courses.find({}, "course_name credit -_id");
        return classes;
      }
}
