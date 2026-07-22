import express from 'express';
import { create, getAll, search, update, remove, purchase } from '../controllers/vehicle.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/authorize.middleware.js';

const router = express.Router();

router.get('/search', search);
router.get('/', getAll);
router.post('/', protect, adminOnly, create);
router.put('/:id', protect, adminOnly, update);
router.delete('/:id', protect, adminOnly, remove);
router.post('/:id/purchase', protect, purchase);

export default router;
