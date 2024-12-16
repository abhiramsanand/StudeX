// course.routes.ts
import express from 'express';
import { ClassController } from '../controllers/classController';


const router = express.Router();
const classController = new ClassController();

router.post('/', classController.createClass);
router.get('/get', classController.getClasses);

export default router;
