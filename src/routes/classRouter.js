"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const classController_1 = require("../controllers/classController");
const router = express_1.default.Router();
const classController = new classController_1.ClassController();
router.post('/', classController.createClass);
router.get('/', classController.getClasses);
router.get('/fetchall', classController.getClassesOnly);
exports.default = router;
