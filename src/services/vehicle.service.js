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
