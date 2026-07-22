import Vehicle from '../models/vehicle.model.js';

const REQUIRED_FIELDS = ['brand', 'model', 'category', 'price', 'quantity'];

const formatVehicle = (vehicle) => ({
  id: vehicle._id,
  brand: vehicle.brand,
  model: vehicle.model,
  category: vehicle.category,
  price: vehicle.price,
  quantity: vehicle.quantity,
});

const validateVehicleInput = ({ brand, model, category, price, quantity }) => {
  const missingFields = REQUIRED_FIELDS.filter((field) => {
    const value = { brand, model, category, price, quantity }[field];
    return value === undefined || value === null || value === '';
  });

  if (missingFields.length > 0) {
    const error = new Error('Brand, model, category, price, and quantity are required validation fields');
    error.statusCode = 400;
    throw error;
  }
};

/**
 * Create a new vehicle in the inventory.
 * @param {Object} vehicleData
 * @returns {Promise<Object>} Formatted vehicle for API response
 */
export const createVehicle = async (vehicleData) => {
  const { brand, model, category, price, quantity } = vehicleData;

  validateVehicleInput({ brand, model, category, price, quantity });

  const vehicle = await Vehicle.create({
    brand,
    model,
    category,
    price,
    quantity,
  });

  return formatVehicle(vehicle);
};

/**
 * Fetch all vehicles from the inventory.
 * @returns {Promise<Object[]>} Formatted vehicles for API response
 */
export const getAllVehicles = async () => {
  const vehicles = await Vehicle.find();
  return vehicles.map(formatVehicle);
};
