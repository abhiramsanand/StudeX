import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { studentName, age, className, email, password, role } = req.body;
            
            if (!studentName || !age || !className || !email || !password) {
                res.status(400).json({ message: 'All fields are required' });
                return;
            }

            const user = await authService.registerStudent(
                studentName, 
                age, 
                className, 
                email, 
                password, 
                role
            );
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }

            const { token, user } = await authService.loginStudent(email, password);
            res.status(200).json({ token, user });
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }
}
