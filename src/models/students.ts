import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

interface IStudents extends Document {
    student_name: string;
    age: number;
    class: Types.ObjectId;
    coursesselected: Types.ObjectId[];
    email: string;
    password: string;
    role: 'admin' | 'user';
    comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IStudentsDocument extends Document {
    password: string;
}

const StudentsSchema: Schema = new Schema(
    {
        student_name: { type: String, required: true },
        age: { type: Number, required: true },
        class: { type: Schema.Types.ObjectId, ref: 'Classes', required: true },
        coursesselected: [
            { type: Schema.Types.ObjectId, ref: 'Courses'}
        ],
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        }
    },
    {
        timestamps: true
    }
);

StudentsSchema.methods.comparePassword = async function (
    this: IStudentsDocument,
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password as string);
};

const Students = mongoose.model<IStudents>('Students', StudentsSchema);
export { Students, IStudents };
