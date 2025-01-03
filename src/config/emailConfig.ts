import nodemailer from "nodemailer";

export const emailConfig = async (
  studentName: string,
  email: string,
  className: string,
  courses: string[]
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_USER,
      pass: process.env.APP_PASS,
    },
  });

  const courseList = courses.join(", ");
  const mailOptions = {
    from: process.env.APP_USER,
    to: email,
    subject: "Class Assignment Notification",
    text: `Hello ${studentName}, you have been assigned to the ${className} class. You can select courses and fill the credits from these courses: ${courseList}.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
