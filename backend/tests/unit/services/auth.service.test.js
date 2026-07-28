import { registerUser, loginUser } from '../../../src/services/auth.service.js';

describe('Auth Service', () => {
  describe('registerUser()', () => {
    test('should reject registration when name is missing', async () => {
      // Arrange
      const userData = { email: 'user@example.com', password: 'password123' };

      // Act & Assert
      await expect(registerUser(userData)).rejects.toThrow('Name, email, and password are required');
    });

    test('should reject registration when email is missing', async () => {
      // Arrange
      const userData = { name: 'John Doe', password: 'password123' };

      // Act & Assert
      await expect(registerUser(userData)).rejects.toThrow('Name, email, and password are required');
    });

    test('should reject registration when password is missing', async () => {
      // Arrange
      const userData = { name: 'John Doe', email: 'user@example.com' };

      // Act & Assert
      await expect(registerUser(userData)).rejects.toThrow('Name, email, and password are required');
    });
  });

  describe('loginUser()', () => {
    test('should reject login when email is missing', async () => {
      // Arrange
      const credentials = { password: 'password123' };

      // Act & Assert
      await expect(loginUser(credentials)).rejects.toThrow('Email and password are required');
    });

    test('should reject login when password is missing', async () => {
      // Arrange
      const credentials = { email: 'user@example.com' };

      // Act & Assert
      await expect(loginUser(credentials)).rejects.toThrow('Email and password are required');
    });
  });
});
