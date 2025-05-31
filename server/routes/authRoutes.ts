import express, { RequestHandler } from 'express';
import { login, register, logout, getMe } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
router.post('/logout', logout as RequestHandler);
router.get('/me', protect as RequestHandler, getMe as RequestHandler);


export default router;
