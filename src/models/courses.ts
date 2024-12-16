import mongoose, { Schema, Document } from 'mongoose';

interface ICourses extends Document {
    course_name: string; 
}

const CoursesSchema: Schema = new Schema({
    course_name: { type: String, required: true, unique: true }, 
});

const Courses = mongoose.model<ICourses>('Courses', CoursesSchema);
export { Courses, ICourses };
