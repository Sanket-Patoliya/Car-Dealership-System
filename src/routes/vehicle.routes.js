import express from 'express';
import { create, getAll, search } from '../controllers/vehicle.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/authorize.middleware.js';

const router = express.Router();

router.get('/search', search);
router.get('/', getAll);
router.post('/', protect, adminOnly, create);

export default router;
