import express, { RequestHandler } from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  addFavorite,
  removeFavorite,
  getFavorites
} from '../controllers/favoriteController';
import { cache } from '../middlewares/cache';

const router = express.Router();

router.post('/:propertyId', protect as RequestHandler, addFavorite as RequestHandler);
router.delete('/:propertyId', protect as RequestHandler, removeFavorite as RequestHandler);
router.get('/', protect as RequestHandler, getFavorites as RequestHandler);

export default router;
