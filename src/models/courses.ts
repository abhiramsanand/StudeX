import mongoose, { Schema, Document } from 'mongoose';

interface ICourses extends Document {
    course_name: string; 
    credit: number;
}

const CoursesSchema: Schema = new Schema({
    course_name: { type: String, required: true, unique: true }, 
    credit: {type: Number, required: true}
});

const Courses = mongoose.model<ICourses>('Courses', CoursesSchema);
export { Courses, ICourses };
