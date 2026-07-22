import { createVehicle } from '../services/vehicle.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const create = catchAsync(async (req, res) => {
  const vehicle = await createVehicle(req.body);

  return res.status(201).json({
    status: 'success',
    data: { vehicle },
  });
});
