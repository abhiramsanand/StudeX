import express from 'express';
import { ClassController } from '../controllers/classController';


const router = express.Router();
const classController = new ClassController();

router.post('/', classController.createClass);
router.get('/', classController.getClasses);
router.get('/fetchall', classController.getClassesOnly);

export default router;
