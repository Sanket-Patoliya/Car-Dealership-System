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

describe('GET /api/vehicles', () => {
  it('should return all vehicles', async () => {
    await Vehicle.create([
      {
        brand: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 28999,
        quantity: 5,
      },
      {
        brand: 'Tesla',
        model: 'Model 3',
        category: 'Electric',
        price: 42990,
        quantity: 12,
      },
      {
        brand: 'BMW',
        model: 'X5',
        category: 'SUV',
        price: 65900,
        quantity: 3,
      },
    ]);

    const res = await request(app).get('/api/vehicles');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('vehicles');
    expect(Array.isArray(res.body.data.vehicles)).toBe(true);
    expect(res.body.data.vehicles).toHaveLength(3);
  });

  it('should return an empty array when no vehicles exist', async () => {
    const res = await request(app).get('/api/vehicles');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('vehicles');
    expect(res.body.data.vehicles).toEqual([]);
  });

  it('should return vehicles with correct fields', async () => {
    const vehicle = await Vehicle.create({
      brand: 'Mercedes-Benz',
      model: 'C-Class',
      category: 'Luxury',
      price: 55900,
      quantity: 7,
    });

    const res = await request(app).get('/api/vehicles');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.vehicles).toHaveLength(1);

    const returnedVehicle = res.body.data.vehicles[0];
    expect(returnedVehicle).toHaveProperty('id', vehicle._id.toString());
    expect(returnedVehicle).toHaveProperty('brand', 'Mercedes-Benz');
    expect(returnedVehicle).toHaveProperty('model', 'C-Class');
    expect(returnedVehicle).toHaveProperty('category', 'Luxury');
    expect(returnedVehicle).toHaveProperty('price', 55900);
    expect(returnedVehicle).toHaveProperty('quantity', 7);
  });
});

describe('GET /api/vehicles/search', () => {
  beforeEach(async () => {
    await Vehicle.create([
      {
        brand: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 28999,
        quantity: 5,
      },
      {
        brand: 'Toyota',
        model: 'RAV4',
        category: 'SUV',
        price: 35000,
        quantity: 8,
      },
      {
        brand: 'Tesla',
        model: 'Model 3',
        category: 'Electric',
        price: 42990,
        quantity: 12,
      },
      {
        brand: 'BMW',
        model: 'X5',
        category: 'SUV',
        price: 65900,
        quantity: 3,
      },
      {
        brand: 'Honda',
        model: 'Civic',
        category: 'Hatchback',
        price: 22000,
        quantity: 10,
      },
    ]);
  });

  it('should search vehicles by make', async () => {
    const res = await request(app).get('/api/vehicles/search').query({ make: 'Toyota' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('vehicles');
    expect(res.body.data.vehicles).toHaveLength(2);
    expect(res.body.data.vehicles.every((vehicle) => vehicle.brand === 'Toyota')).toBe(true);
  });

  it('should search vehicles by model', async () => {
    const res = await request(app).get('/api/vehicles/search').query({ model: 'Camry' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data.vehicles).toHaveLength(1);
    expect(res.body.data.vehicles[0]).toMatchObject({
      brand: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 28999,
    });
  });

  it('should search vehicles by category', async () => {
    const res = await request(app).get('/api/vehicles/search').query({ category: 'SUV' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data.vehicles).toHaveLength(2);
    expect(res.body.data.vehicles.every((vehicle) => vehicle.category === 'SUV')).toBe(true);
  });

  it('should search vehicles by price range', async () => {
    const res = await request(app)
      .get('/api/vehicles/search')
      .query({ minPrice: 30000, maxPrice: 50000 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data.vehicles).toHaveLength(2);
    expect(res.body.data.vehicles.every((vehicle) => vehicle.price >= 30000 && vehicle.price <= 50000)).toBe(true);
  });

  it('should return an empty array when no vehicles match', async () => {
    const res = await request(app).get('/api/vehicles/search').query({ make: 'NonExistent' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('vehicles');
    expect(res.body.data.vehicles).toEqual([]);
  });
});

describe('PUT /api/vehicles/:id', () => {
  const existingVehicle = {
    brand: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 28999,
    quantity: 5,
  };

  const updatedVehicle = {
    brand: 'Honda',
    model: 'Accord',
    category: 'Sedan',
    price: 31999,
    quantity: 6,
  };

  let adminToken;
  let userToken;
  let vehicle;

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

    vehicle = await Vehicle.create(existingVehicle);
  });

  it('should allow an admin to update a vehicle', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedVehicle);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('vehicle');

    const returnedVehicle = res.body.data.vehicle;
    expect(returnedVehicle).toHaveProperty('id', vehicle._id.toString());
    expect(returnedVehicle).toMatchObject(updatedVehicle);

    const vehicleInDb = await Vehicle.findById(vehicle._id);
    expect(vehicleInDb.brand).toBe(updatedVehicle.brand);
    expect(vehicleInDb.model).toBe(updatedVehicle.model);
    expect(vehicleInDb.category).toBe(updatedVehicle.category);
    expect(vehicleInDb.price).toBe(updatedVehicle.price);
    expect(vehicleInDb.quantity).toBe(updatedVehicle.quantity);
  });

  it('should reject vehicle update by a normal user', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updatedVehicle);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body.message).toMatch(/permission|authorized|forbidden/i);

    const vehicleInDb = await Vehicle.findById(vehicle._id);
    expect(vehicleInDb.brand).toBe(existingVehicle.brand);
    expect(vehicleInDb.model).toBe(existingVehicle.model);
    expect(vehicleInDb.price).toBe(existingVehicle.price);
  });

  it('should reject invalid vehicle IDs', async () => {
    const invalidIdCases = [
      {
        id: 'invalid-id-format',
        expectedStatus: 400,
        messagePattern: /invalid|id/i,
      },
      {
        id: new mongoose.Types.ObjectId(),
        expectedStatus: 404,
        messagePattern: /not found|exist/i,
      },
    ];

    for (const { id, expectedStatus, messagePattern } of invalidIdCases) {
      const res = await request(app)
        .put(`/api/vehicles/${id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedVehicle);

      expect(res.statusCode).toBe(expectedStatus);
      expect(res.body).toHaveProperty('status', 'fail');
      expect(res.body.message).toMatch(messagePattern);
    }
  });

  it('should reject requests with invalid data', async () => {
    const invalidDataCases = [
      { ...updatedVehicle, price: -1000 },
      { ...updatedVehicle, category: 'Truck' },
      { ...updatedVehicle, quantity: 2.5 },
      { model: 'Accord', category: 'Sedan', price: 31999, quantity: 6 },
    ];

    for (const invalidVehicle of invalidDataCases) {
      const res = await request(app)
        .put(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidVehicle);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('status', 'fail');
      expect(res.body.message).toMatch(/required|missing|validate|validation|invalid|negative|whole number|category/i);
    }

    const vehicleInDb = await Vehicle.findById(vehicle._id);
    expect(vehicleInDb.brand).toBe(existingVehicle.brand);
    expect(vehicleInDb.model).toBe(existingVehicle.model);
    expect(vehicleInDb.price).toBe(existingVehicle.price);
    expect(vehicleInDb.quantity).toBe(existingVehicle.quantity);
  });
});

describe('DELETE /api/vehicles/:id', () => {
  const existingVehicle = {
    brand: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 28999,
    quantity: 5,
  };

  let adminToken;
  let userToken;
  let vehicle;

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

    vehicle = await Vehicle.create(existingVehicle);
  });

  it('should allow an admin to delete a vehicle', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');

    const vehicleInDb = await Vehicle.findById(vehicle._id);
    expect(vehicleInDb).toBeNull();
  });

  it('should reject vehicle deletion by a normal user', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body.message).toMatch(/permission|authorized|forbidden/i);

    const vehicleInDb = await Vehicle.findById(vehicle._id);
    expect(vehicleInDb).not.toBeNull();
  });

  it('should reject invalid vehicle IDs', async () => {
    const invalidIdCases = [
      {
        id: 'invalid-id-format',
        expectedStatus: 400,
        messagePattern: /invalid|id/i,
      },
      {
        id: new mongoose.Types.ObjectId(),
        expectedStatus: 404,
        messagePattern: /not found|exist/i,
      },
    ];

    for (const { id, expectedStatus, messagePattern } of invalidIdCases) {
      const res = await request(app)
        .delete(`/api/vehicles/${id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(expectedStatus);
      expect(res.body).toHaveProperty('status', 'fail');
      expect(res.body.message).toMatch(messagePattern);
    }
  });
});

describe('POST /api/vehicles/:id/purchase', () => {
  const existingVehicle = {
    brand: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 28999,
    quantity: 5,
  };

  let userToken;
  let vehicle;

  beforeEach(async () => {
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });

    userToken = generateToken(regularUser._id);
    vehicle = await Vehicle.create(existingVehicle);
  });

  it('should purchase a vehicle successfully and decrease the quantity', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('vehicle');

    const updatedVehicle = res.body.data.vehicle;
    expect(updatedVehicle).toHaveProperty('quantity', existingVehicle.quantity - 1);

    const vehicleInDb = await Vehicle.findById(vehicle._id);
    expect(vehicleInDb.quantity).toBe(existingVehicle.quantity - 1);
  });

  it('should reject purchase when the vehicle is out of stock', async () => {
    // Set quantity to 0
    await Vehicle.findByIdAndUpdate(vehicle._id, { quantity: 0 });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body.message).toMatch(/out of stock|unavailable|no inventory/i);

    const vehicleInDb = await Vehicle.findById(vehicle._id);
    expect(vehicleInDb.quantity).toBe(0);
  });

  it('should reject invalid vehicle IDs', async () => {
    const invalidIdCases = [
      {
        id: 'invalid-id-format',
        expectedStatus: 400,
        messagePattern: /invalid|id/i,
      },
      {
        id: new mongoose.Types.ObjectId(),
        expectedStatus: 404,
        messagePattern: /not found|exist/i,
      },
    ];

    for (const { id, expectedStatus, messagePattern } of invalidIdCases) {
      const res = await request(app)
        .post(`/api/vehicles/${id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(expectedStatus);
      expect(res.body).toHaveProperty('status', 'fail');
      expect(res.body.message).toMatch(messagePattern);
    }
  });
});

describe('POST /api/vehicles/:id/restock', () => {
  const existingVehicle = {
    brand: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 28999,
    quantity: 5,
  };

  let adminToken;
  let userToken;
  let vehicle;

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
    vehicle = await Vehicle.create(existingVehicle);
  });

  it('should allow an admin to restock a vehicle and increase the quantity', async () => {
    const restockQty = 10;
    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: restockQty });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('vehicle');

    const updatedVehicle = res.body.data.vehicle;
    expect(updatedVehicle).toHaveProperty('quantity', existingVehicle.quantity + restockQty);

    const vehicleInDb = await Vehicle.findById(vehicle._id);
    expect(vehicleInDb.quantity).toBe(existingVehicle.quantity + restockQty);
  });

  it('should reject restock requests by normal users', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 10 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body.message).toMatch(/permission|authorized|forbidden/i);

    const vehicleInDb = await Vehicle.findById(vehicle._id);
    expect(vehicleInDb.quantity).toBe(existingVehicle.quantity);
  });

  it('should reject invalid vehicle IDs', async () => {
    const invalidIdCases = [
      {
        id: 'invalid-id-format',
        expectedStatus: 400,
        messagePattern: /invalid|id/i,
      },
      {
        id: new mongoose.Types.ObjectId(),
        expectedStatus: 404,
        messagePattern: /not found|exist/i,
      },
    ];

    for (const { id, expectedStatus, messagePattern } of invalidIdCases) {
      const res = await request(app)
        .post(`/api/vehicles/${id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(res.statusCode).toBe(expectedStatus);
      expect(res.body).toHaveProperty('status', 'fail');
      expect(res.body.message).toMatch(messagePattern);
    }
  });

  it('should reject restock with invalid or missing quantity', async () => {
    const invalidDataCases = [
      { quantity: -5 }, // negative
      { quantity: 2.5 }, // float
      { quantity: 'invalid-number' }, // string
      {}, // missing
    ];

    for (const invalidPayload of invalidDataCases) {
      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidPayload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('status', 'fail');
      expect(res.body.message).toMatch(/required|invalid|positive|whole number|quantity/i);
    }
  });
});



