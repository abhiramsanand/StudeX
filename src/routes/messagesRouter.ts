import express from 'express';
import { MessageController } from '../controllers/messagesController';

const router = express.Router();
const messagesController = new MessageController();

router.post('/create', messagesController.createMessage);
router.post('/', messagesController.getMessages);

export default router;