import { create, update, remove, purchase, restock } from '../../../src/controllers/vehicle.controller.js';

describe('Vehicle Controller', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      statusCode: 0,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };
  });

  afterEach(() => {
    mockRes = null;
  });

  describe('create()', () => {
    test('should forward validation error to next middleware when payload is incomplete', async () => {
      // Arrange
      const req = {
        body: {
          brand: 'Toyota',
          // missing model, category, price, quantity
        },
      };

      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      // Act
      create(req, mockRes, next);
      await new Promise((resolve) => setImmediate(resolve));

      // Assert
      expect(capturedError).toBeDefined();
      expect(capturedError).toBeInstanceOf(Error);
      expect(capturedError.message).toMatch(/required/i);
    });
  });

  describe('update()', () => {
    test('should forward error to next middleware when vehicle ID format is invalid', async () => {
      // Arrange
      const req = {
        params: { id: 'invalid-id' },
        body: {
          brand: 'Toyota',
          model: 'Camry',
          category: 'Sedan',
          price: 25000,
          quantity: 5,
        },
      };

      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      // Act
      update(req, mockRes, next);
      await new Promise((resolve) => setImmediate(resolve));

      // Assert
      expect(capturedError).toBeDefined();
      expect(capturedError).toBeInstanceOf(Error);
      expect(capturedError.message).toMatch(/invalid/i);
    });
  });

  describe('remove()', () => {
    test('should forward error to next middleware when vehicle ID format is invalid', async () => {
      // Arrange
      const req = {
        params: { id: 'invalid-id' },
      };

      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      // Act
      remove(req, mockRes, next);
      await new Promise((resolve) => setImmediate(resolve));

      // Assert
      expect(capturedError).toBeDefined();
      expect(capturedError).toBeInstanceOf(Error);
      expect(capturedError.message).toMatch(/invalid/i);
    });
  });

  describe('purchase()', () => {
    test('should forward error to next middleware when vehicle ID format is invalid', async () => {
      // Arrange
      const req = {
        params: { id: 'invalid-id' },
      };

      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      // Act
      purchase(req, mockRes, next);
      await new Promise((resolve) => setImmediate(resolve));

      // Assert
      expect(capturedError).toBeDefined();
      expect(capturedError).toBeInstanceOf(Error);
      expect(capturedError.message).toMatch(/invalid/i);
    });
  });

  describe('restock()', () => {
    test('should forward error to next middleware when quantity is invalid or negative', async () => {
      // Arrange
      const req = {
        params: { id: '507f1f77bcf86cd799439011' },
        body: { quantity: -5 },
      };

      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      // Act
      restock(req, mockRes, next);
      await new Promise((resolve) => setImmediate(resolve));

      // Assert
      expect(capturedError).toBeDefined();
      expect(capturedError).toBeInstanceOf(Error);
      expect(capturedError.message).toMatch(/positive whole number/i);
    });
  });
});
