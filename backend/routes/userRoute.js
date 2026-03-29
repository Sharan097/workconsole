import express from 'express';
import { getCurrentUser, loginUser, registerUser, updatePassword, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

//PUBLIC LINKS
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);


//PRIVATE LINKS protect using middleware
userRouter.get('/me', authMiddleware, getCurrentUser);
userRouter.put('/password', authMiddleware, updatePassword);
userRouter.put('/profile', authMiddleware, updateProfile);


export default userRouter;