"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const authService = new authService_1.AuthService();
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentName, age, className, email, password, role } = req.body;
                if (!studentName || !age || !className || !email || !password) {
                    res.status(400).json({ message: 'All fields are required' });
                    return;
                }
                const user = yield authService.registerStudent(studentName, age, className, email, password, role);
                res.status(201).json({ message: 'User registered successfully', user });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    registerAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { adminName, email, password } = req.body;
                const role = 'admin';
                if (!adminName || !email || !password) {
                    res.status(400).json({ message: 'All fields are required' });
                    return;
                }
                const user = yield authService.registerAdmin(adminName, email, password, role);
                res.status(201).json({ message: 'User registered successfully', user });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ message: "Email and password are required" });
                    return;
                }
                const { token, user, role } = yield authService.loginUser(email, password);
                res.status(200).json({ token, user, role });
            }
            catch (error) {
                res.status(401).json({ message: error.message });
            }
        });
    }
}
exports.AuthController = AuthController;
