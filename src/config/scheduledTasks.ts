import cron from "node-cron";
import { Students } from "../models/students";
import { noCourses } from "./sendEmails";

export const scheduledTask1 = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const studentsWithoutCourses = await Students.find(
        { coursesselected: { $size: 0 } },
        "email student_name -_id"
      );

      if (studentsWithoutCourses.length > 0) {
        for (const student of studentsWithoutCourses) {
          const studentName = student.student_name;
          const studentEmail = student.email;

          await noCourses(studentName, studentEmail);
        }
      } else {
        console.log("No students found without selected courses.");
      }
    } catch (error) {
      console.error("Error fetching students without courses:", error);
    }
  });
};
