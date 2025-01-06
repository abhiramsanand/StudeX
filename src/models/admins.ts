import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

interface IAdmins extends Document {
  admin_name: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IAdminsDocument extends Document {
  password: string;
}

const AdminsSchema: Schema = new Schema(
  {
    admin_name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

AdminsSchema.methods.comparePassword = async function (
  this: IAdminsDocument,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

const Admins = mongoose.model<IAdmins>("Admins", AdminsSchema);
export { Admins, IAdmins };
