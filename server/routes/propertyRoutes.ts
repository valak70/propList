import express, { RequestHandler } from 'express';
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController';
import { protect } from '../middlewares/authMiddleware';
import { cache } from '../middlewares/cache';

const router = express.Router();

router.post('/', protect as RequestHandler, createProperty as RequestHandler);
router.get('/', cache('properties'), getAllProperties as RequestHandler);
router.get('/:id', cache('property'), getPropertyById as RequestHandler);
router.put('/:id', protect as RequestHandler, updateProperty as RequestHandler);
router.delete('/:id', protect as RequestHandler, deleteProperty as RequestHandler);

export default router;
