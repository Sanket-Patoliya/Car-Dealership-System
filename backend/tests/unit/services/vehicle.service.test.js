import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from '../../../src/services/vehicle.service.js';

describe('Vehicle Service', () => {
  describe('createVehicle()', () => {
    test('should reject creation when brand is missing', async () => {
      // Arrange
      const incompleteVehicle = {
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      };

      // Act & Assert
      await expect(createVehicle(incompleteVehicle)).rejects.toThrow(
        'Brand, model, category, price, and quantity are required validation fields'
      );
    });

    test('should reject creation when price is missing', async () => {
      // Arrange
      const incompleteVehicle = {
        brand: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        quantity: 5,
      };

      // Act & Assert
      await expect(createVehicle(incompleteVehicle)).rejects.toThrow(
        'Brand, model, category, price, and quantity are required validation fields'
      );
    });
  });

  describe('updateVehicle()', () => {
    test('should reject update when vehicle ID format is invalid', async () => {
      // Arrange
      const invalidId = 'invalid-id-123';
      const vehicleData = {
        brand: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      };

      // Act & Assert
      await expect(updateVehicle(invalidId, vehicleData)).rejects.toThrow('Invalid vehicle ID format');
    });

    test('should reject update when payload fields are missing', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const incompleteData = { brand: 'Toyota' };

      // Act & Assert
      await expect(updateVehicle(validId, incompleteData)).rejects.toThrow(
        'Brand, model, category, price, and quantity are required validation fields'
      );
    });
  });

  describe('deleteVehicle()', () => {
    test('should reject deletion when vehicle ID format is invalid', async () => {
      // Arrange
      const invalidId = 'invalid-id-123';

      // Act & Assert
      await expect(deleteVehicle(invalidId)).rejects.toThrow('Invalid vehicle ID format');
    });
  });

  describe('purchaseVehicle()', () => {
    test('should reject purchase when vehicle ID format is invalid', async () => {
      // Arrange
      const invalidId = 'invalid-id-123';

      // Act & Assert
      await expect(purchaseVehicle(invalidId)).rejects.toThrow('Invalid vehicle ID format');
    });
  });

  describe('restockVehicle()', () => {
    test('should reject restock when vehicle ID format is invalid', async () => {
      // Arrange
      const invalidId = 'invalid-id-123';

      // Act & Assert
      await expect(restockVehicle(invalidId, 10)).rejects.toThrow('Invalid vehicle ID format');
    });

    test('should reject restock when quantity is missing', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';

      // Act & Assert
      await expect(restockVehicle(validId, undefined)).rejects.toThrow('Restock quantity is required');
    });

    test('should reject restock when quantity is negative', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';

      // Act & Assert
      await expect(restockVehicle(validId, -5)).rejects.toThrow('Restock quantity must be a positive whole number');
    });

    test('should reject restock when quantity is not a whole number', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';

      // Act & Assert
      await expect(restockVehicle(validId, 3.14)).rejects.toThrow('Restock quantity must be a positive whole number');
    });
  });
});
