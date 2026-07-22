import Vehicle from '../models/vehicle.model.js';

/**
 * Create a new vehicle in the inventory.
 * @param {Object} vehicleData
 * @returns {Promise<Object>} The newly created Vehicle document
 */
export const createVehicle = async ({ brand, model, category, price, quantity }) => {
  if (!brand || !model || !category || price === undefined || quantity === undefined) {
    const error = new Error('Brand, model, category, price, and quantity are required validation fields');
    error.statusCode = 400;
    throw error;
  }

  const vehicle = await Vehicle.create({
    brand,
    model,
    category,
    price,
    quantity,
  });

  return vehicle;
};
