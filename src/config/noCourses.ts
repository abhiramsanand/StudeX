import nodemailer from "nodemailer";

export const noCourses = async (
  studentName: string,
  email: string,
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_USER,
      pass: process.env.APP_PASS,
    },
  });

  const noCoursesSelected = {
    from: process.env.APP_USER,
    to: email,
    subject: "No Courses Selected",
    text: `Hello ${studentName}, you have not selected any of the courses to fill in your credits till now.`,
  };

  try {
    const info = await transporter.sendMail(noCoursesSelected);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
