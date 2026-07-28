import express from 'express';
import { create, getAll, search, update, remove, purchase, restock } from '../controllers/vehicle.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/authorize.middleware.js';
import {
  createVehicleValidator,
  updateVehicleValidator,
  restockVehicleValidator,
  vehicleIdParamValidator,
} from '../validators/vehicle.validator.js';

const router = express.Router();

router.get('/search', search);
router.get('/', getAll);
router.post('/', protect, adminOnly, createVehicleValidator, create);
router.put('/:id', protect, adminOnly, updateVehicleValidator, update);
router.delete('/:id', protect, adminOnly, vehicleIdParamValidator, remove);
router.post('/:id/purchase', protect, vehicleIdParamValidator, purchase);
router.post('/:id/restock', protect, adminOnly, restockVehicleValidator, restock);

export default router;

