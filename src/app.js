"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const courseRouter_1 = __importDefault(require("./routes/courseRouter"));
const classRouter_1 = __importDefault(require("./routes/classRouter"));
const studentRouter_1 = __importDefault(require("./routes/studentRouter"));
const messagesRouter_1 = __importDefault(require("./routes/messagesRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use("/api/auth", authRouter_1.default);
app.use("/api/courses", authMiddleware_1.authenticateToken, courseRouter_1.default);
app.use("/api/classes", authMiddleware_1.authenticateToken, classRouter_1.default);
app.use("/api/students", authMiddleware_1.authenticateToken, studentRouter_1.default);
app.use("/api/messages", authMiddleware_1.authenticateToken, messagesRouter_1.default);
exports.default = app;
