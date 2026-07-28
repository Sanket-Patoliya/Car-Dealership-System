import { body, param } from 'express-validator';
import { validate } from './validate.middleware.js';
import { VEHICLE_CATEGORIES } from '../constants/vehicle.constants.js';
import mongoose from 'mongoose';

const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid vehicle ID format');
  }
  return true;
};

/**
 * Validation rules for creating a vehicle.
 */
export const createVehicleValidator = [
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(VEHICLE_CATEGORIES)
    .withMessage(`Category must be one of: ${VEHICLE_CATEGORIES.join(', ')}`),
  body('price')
    .exists({ checkNull: true, checkFalsy: false })
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  body('quantity')
    .exists({ checkNull: true, checkFalsy: false })
    .withMessage('Quantity is required')
    .custom((val) => {
      if (typeof val !== 'number' || !Number.isInteger(val) || val < 0) {
        throw new Error('Quantity must be a positive whole number');
      }
      return true;
    }),
  validate,
];

/**
 * Validation rules for updating a vehicle.
 */
export const updateVehicleValidator = [
  param('id').custom(isValidObjectId),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(VEHICLE_CATEGORIES)
    .withMessage(`Category must be one of: ${VEHICLE_CATEGORIES.join(', ')}`),
  body('price')
    .exists({ checkNull: true, checkFalsy: false })
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  body('quantity')
    .exists({ checkNull: true, checkFalsy: false })
    .withMessage('Quantity is required')
    .custom((val) => {
      if (typeof val !== 'number' || !Number.isInteger(val) || val < 0) {
        throw new Error('Quantity must be a positive whole number');
      }
      return true;
    }),
  validate,
];

/**
 * Validation rules for restocking a vehicle.
 */
export const restockVehicleValidator = [
  param('id').custom(isValidObjectId),
  body('quantity')
    .exists({ checkNull: true, checkFalsy: false })
    .withMessage('Restock quantity is required')
    .custom((val) => {
      if (typeof val !== 'number' || !Number.isInteger(val) || val <= 0) {
        throw new Error('Restock quantity must be a positive whole number');
      }
      return true;
    }),
  validate,
];

/**
 * Validation rules for single vehicle ID params (e.g. purchase, delete).
 */
export const vehicleIdParamValidator = [
  param('id').custom(isValidObjectId),
  validate,
];
