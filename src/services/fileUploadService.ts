import { Courses, ICourses } from "../models/courses";

export const bulkCreateCourses = async (coursesData: any[]): Promise<ICourses[]> => {
  try {
    const coursesToCreate = coursesData.map((course) => ({
      course_name: course.course_name,
      credit: course.credit,
    }));

    const createdCourses = await Courses.insertMany(coursesToCreate);
    return createdCourses;
  } catch (error: any) {
    throw new Error('Error while creating courses: ' + error.message);
  }
};
