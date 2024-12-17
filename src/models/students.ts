import mongoose, { Schema, Document, Types } from 'mongoose';

interface IStudents extends Document {
    student_name: string;
    age: number;
    class: Types.ObjectId[];
}

const StudentsSchema: Schema = new Schema({
    student_name: { type: String, required: true },
    age: { type: Number, required: true },
    class: { type: Schema.Types.ObjectId, ref: 'Classes', required: true },
});

const Students = mongoose.model<IStudents>('Students', StudentsSchema);
export { Students, IStudents };