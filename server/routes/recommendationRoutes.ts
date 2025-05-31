import express, { RequestHandler } from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  recommendProperty,
  getRecommendations
} from '../controllers/recommendationController';

const router = express.Router();

router.post('/', protect as RequestHandler, recommendProperty as RequestHandler);
router.get('/', protect as RequestHandler, getRecommendations as RequestHandler);

export default router;
