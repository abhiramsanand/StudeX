import { emailConfig } from "./emailConfig";

export const classAssigned = async (
  studentName: string,
  email: string,
  className: string,
  courses: string[]
) => {
  const courseList = courses.join(", ");
  const message = `Hello ${studentName}, you have been assigned to the ${className} class. You can select courses and fill the credits from these courses: ${courseList}.`;

  await emailConfig(email, "Class Assignment Notification", message);
};

export const noCourses = async (studentName: string, email: string) => {
  const message = `Hello ${studentName}, you have not selected any of the courses to fill in your credits till now.`;

  await emailConfig(email, "No Courses Selected", message);
};
