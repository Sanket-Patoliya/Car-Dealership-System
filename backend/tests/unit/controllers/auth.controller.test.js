import { register, login } from '../../../src/controllers/auth.controller.js';

describe('Auth Controller', () => {
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

  describe('register()', () => {
    test('should forward validation error to next middleware when body is missing required fields', async () => {
      // Arrange
      const req = {
        body: {
          name: 'John Doe',
          email: '', // missing email
          password: 'password123',
        },
      };

      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      // Act
      register(req, mockRes, next);
      await new Promise((resolve) => setImmediate(resolve));

      // Assert
      expect(capturedError).toBeDefined();
      expect(capturedError).toBeInstanceOf(Error);
      expect(capturedError.message).toMatch(/required/i);
    });
  });

  describe('login()', () => {
    test('should forward validation error to next middleware when credentials are missing', async () => {
      // Arrange
      const req = {
        body: {
          email: '', // missing email
          password: 'password123',
        },
      };

      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      // Act
      login(req, mockRes, next);
      await new Promise((resolve) => setImmediate(resolve));

      // Assert
      expect(capturedError).toBeDefined();
      expect(capturedError).toBeInstanceOf(Error);
      expect(capturedError.message).toMatch(/required/i);
    });
  });
});
