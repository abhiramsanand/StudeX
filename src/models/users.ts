import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    email: string;
    password: string;
    role: 'admin' | 'user';
    comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserDocument extends Document {
    password: string;
}

const UserSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function(this: IUserDocument, next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password as string, salt);
        this.password = hashedPassword;
        next();
    } catch (error: any) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function(this: IUserDocument, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password as string);
};

export const User = mongoose.model<IUser>('User', UserSchema);