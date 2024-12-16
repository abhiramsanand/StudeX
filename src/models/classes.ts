import mongoose, { Schema, Document, Types } from 'mongoose';

interface IClasses extends Document {
    class_name: string; // Class name
    courses: Types.ObjectId; // Array of course IDs
}

const ClassesSchema: Schema = new Schema({
    class_name: { type: String, required: true, unique: true }, 
    courses: { type: Schema.Types.ObjectId, ref: 'Courses' },
});

const Classes = mongoose.model<IClasses>('Classes', ClassesSchema);
export { Classes, IClasses };
