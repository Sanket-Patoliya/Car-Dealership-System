import { createVehicle } from '../services/vehicle.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const create = catchAsync(async (req, res) => {
  const { brand, model, category, price, quantity } = req.body;

  const vehicle = await createVehicle({ brand, model, category, price, quantity });

  return res.status(201).json({
    status: 'success',
    data: {
      vehicle: {
        id: vehicle._id,
        brand: vehicle.brand,
        model: vehicle.model,
        category: vehicle.category,
        price: vehicle.price,
        quantity: vehicle.quantity,
      },
    },
  });
});
