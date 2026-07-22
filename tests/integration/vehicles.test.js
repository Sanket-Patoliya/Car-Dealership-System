import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/user.model.js';
import Vehicle from '../../src/models/vehicle.model.js';
import { generateToken } from '../../src/utils/jwt.js';

describe('POST /api/vehicles', () => {
  const validVehicle = {
    brand: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 28999,
    quantity: 5,
  };

  let adminToken;
  let userToken;

  beforeEach(async () => {
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });

    adminToken = generateToken(adminUser._id);
    userToken = generateToken(regularUser._id);
  });

  it('should allow an admin to create a vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validVehicle);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('vehicle');

    const returnedVehicle = res.body.data.vehicle;
    expect(returnedVehicle).toHaveProperty('id');
    expect(returnedVehicle).toHaveProperty('brand', validVehicle.brand);
    expect(returnedVehicle).toHaveProperty('model', validVehicle.model);
    expect(returnedVehicle).toHaveProperty('category', validVehicle.category);
    expect(returnedVehicle).toHaveProperty('price', validVehicle.price);
    expect(returnedVehicle).toHaveProperty('quantity', validVehicle.quantity);

    const vehicleInDb = await Vehicle.findOne({
      brand: validVehicle.brand,
      model: validVehicle.model,
    });
    expect(vehicleInDb).not.toBeNull();
    expect(vehicleInDb.category).toBe(validVehicle.category);
    expect(vehicleInDb.price).toBe(validVehicle.price);
    expect(vehicleInDb.quantity).toBe(validVehicle.quantity);
  });

  it('should reject vehicle creation by a normal user', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validVehicle);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body.message).toMatch(/permission|authorized|forbidden/i);

    const vehicleCount = await Vehicle.countDocuments();
    expect(vehicleCount).toBe(0);
  });

  it('should reject requests with missing fields', async () => {
    const testCases = [
      { model: 'Camry', category: 'Sedan', price: 28999, quantity: 5 }, // brand missing
      { brand: 'Toyota', category: 'Sedan', price: 28999, quantity: 5 }, // model missing
      { brand: 'Toyota', model: 'Camry', price: 28999, quantity: 5 }, // category missing
      { brand: 'Toyota', model: 'Camry', category: 'Sedan', quantity: 5 }, // price missing
      { brand: 'Toyota', model: 'Camry', category: 'Sedan', price: 28999 }, // quantity missing
    ];

    for (const incompleteVehicle of testCases) {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteVehicle);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('status', 'fail');
      expect(res.body.message).toMatch(/required|missing|validate|validation/i);
    }

    const vehicleCount = await Vehicle.countDocuments();
    expect(vehicleCount).toBe(0);
  });
});
