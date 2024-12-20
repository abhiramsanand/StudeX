import mongoose, { Schema, Document, Types } from 'mongoose';

interface IClasses extends Document {
    class_name: string; 
    courses: Types.ObjectId[]; 
}

const ClassesSchema: Schema = new Schema({
    class_name: { type: String, required: true, unique: true }, 
    courses: [{ type: Schema.Types.ObjectId, ref: 'Courses', required: true }], 
});

const Classes = mongoose.model<IClasses>('Classes', ClassesSchema);
export { Classes, IClasses };
