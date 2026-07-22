import express from 'express';
import { create } from '../controllers/vehicle.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/authorize.middleware.js';

const router = express.Router();

router.post('/', protect, adminOnly, create);

export default router;
