import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/users';

export class AuthService {
    private readonly JWT_SECRET: string;
    private readonly JWT_EXPIRES_IN: string;

    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        this.JWT_EXPIRES_IN = '24h';
    }

    async registerUser(email: string, password: string, role: 'admin' | 'user' = 'user'): Promise<IUser> {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const user = new User({ email, password, role });
        return await user.save();
    }

    async loginUser(email: string, password: string): Promise<{ token: string, user: IUser }> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user);
        return { token, user };
    }

    private generateToken(user: IUser): string {
        return jwt.sign(
            { 
                userId: user._id, 
                email: user.email,
                role: user.role 
            },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRES_IN }
        );
    }
}