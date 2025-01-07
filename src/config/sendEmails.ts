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

export const messageNew = async (
  studentName: string,
  sender: string,
  email: string,
  content: string
) => {
  const message = `Hi ${studentName}, there is a new messge for you in StudeX. ${sender} says: "${content}"`;

  await emailConfig(email, "New message in StudeX", message);
};
