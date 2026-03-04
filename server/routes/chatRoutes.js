import express from 'express'
import { createChat, getChats,  deleteChat} from '../controllers/chatController.js';
import { protect } from '../middlewires/auth.js';

const chatRouter = express.Router();

chatRouter.get('/create', protect, createChat);
chatRouter.get('/get', protect, getChats);
chatRouter.post('/delete', protect, deleteChat);
// chatRouter.use('/api/user', protect, getChats);
// chatRouter.use('/api/chat', protect, deleteChat);


export default chatRouter  