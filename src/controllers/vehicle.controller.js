import { createVehicle, getAllVehicles, searchVehicles, updateVehicle, deleteVehicle } from '../services/vehicle.service.js';
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

export const search = catchAsync(async (req, res) => {
  const vehicles = await searchVehicles(req.query);

  return res.status(200).json({
    status: 'success',
    data: { vehicles },
  });
});

export const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const vehicle = await updateVehicle(id, req.body);

  return res.status(200).json({
    status: 'success',
    data: { vehicle },
  });
});

export const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteVehicle(id);

  return res.status(200).json({
    status: 'success',
  });
});


