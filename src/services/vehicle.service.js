import { validateObjectId } from '../utils/validation.js';
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

const SEARCH_FILTER_MAP = {
  make: 'brand',
  model: 'model',
  category: 'category',
};

const buildPriceRangeFilter = (minPrice, maxPrice) => {
  if (minPrice === undefined && maxPrice === undefined) {
    return undefined;
  }

  const priceFilter = {};
  if (minPrice !== undefined) priceFilter.$gte = Number(minPrice);
  if (maxPrice !== undefined) priceFilter.$lte = Number(maxPrice);

  return priceFilter;
};

const buildVehicleSearchFilter = ({ make, model, category, minPrice, maxPrice }) => {
  const filter = {};

  if (make) filter[SEARCH_FILTER_MAP.make] = make;
  if (model) filter[SEARCH_FILTER_MAP.model] = model;
  if (category) filter[SEARCH_FILTER_MAP.category] = category;

  const priceFilter = buildPriceRangeFilter(minPrice, maxPrice);
  if (priceFilter) {
    filter.price = priceFilter;
  }

  return filter;
};

/**
 * Search vehicles using optional filters.
 * @param {Object} filters
 * @returns {Promise<Object[]>} Formatted matching vehicles for API response
 */
export const searchVehicles = async (filters) => {
  const query = buildVehicleSearchFilter(filters);
  const vehicles = await Vehicle.find(query);

  return vehicles.map(formatVehicle);
};

/**
 * Update an existing vehicle in the inventory.
 * @param {string} id
 * @param {Object} vehicleData
 * @returns {Promise<Object>} Formatted updated vehicle for API response
 */
export const updateVehicle = async (id, vehicleData) => {
  // 1. Validate ObjectId format
  validateObjectId(id, 'vehicle ID');

  // 2. Validate required fields
  const { brand, model, category, price, quantity } = vehicleData;
  validateVehicleInput({ brand, model, category, price, quantity });

  // 3. Find and update the vehicle with validations active
  const vehicle = await Vehicle.findByIdAndUpdate(
    id,
    { brand, model, category, price, quantity },
    { new: true, runValidators: true }
  );

  // 4. Reject if not found
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  return formatVehicle(vehicle);
};

/**
 * Delete an existing vehicle from the inventory.
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteVehicle = async (id) => {
  // 1. Validate ObjectId format
  validateObjectId(id, 'vehicle ID');

  // 2. Find and delete the vehicle
  const vehicle = await Vehicle.findByIdAndDelete(id);

  // 3. Reject if not found
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }
};

/**
 * Purchase a vehicle: atomically decrements quantity by 1 if in stock.
 * @param {string} id - The vehicle ID to purchase
 * @returns {Promise<Object>} Formatted updated vehicle
 */
export const purchaseVehicle = async (id) => {
  // 1. Validate ObjectId format
  validateObjectId(id, 'vehicle ID');

  // 2. Perform atomic decrement if quantity > 0
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: id, quantity: { $gt: 0 } },
    { $inc: { quantity: -1 } },
    { new: true }
  );

  // 3. Handle errors if the atomic update failed
  if (!vehicle) {
    const exists = await Vehicle.findById(id);
    if (!exists) {
      const error = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }

    const error = new Error('Vehicle is out of stock');
    error.statusCode = 400;
    throw error;
  }

  return formatVehicle(vehicle);
};



