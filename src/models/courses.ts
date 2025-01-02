import mongoose, { Schema, Document } from 'mongoose';
import EventEmitter from 'events';

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

export const courseEvents = new EventEmitter();
