import { createVehicle, getAllVehicles } from '../services/vehicle.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const create = catchAsync(async (req, res) => {
  const vehicle = await createVehicle(req.body);

  return res.status(201).json({
    status: 'success',
    data: { vehicle },
  });
});

export const getAll = catchAsync(async (req, res) => {
  const vehicles = await getAllVehicles();

  return res.status(200).json({
    status: 'success',
    data: { vehicles },
  });
});
