import request from 'supertest';
import app from '../../src/app.js';

describe('GET /api/health', () => {
  it('should return a 200 status code and healthy response structure', async () => {
    const response = await request(app).get('/api/health');

    // Verify status code is 200 OK
    expect(response.statusCode).toBe(200);

    // Verify response body properties and content
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Server is healthy');
    expect(response.body).toHaveProperty('timestamp');
    
    // Verify timestamp parses as a valid date
    const parsedDate = new Date(response.body.timestamp);
    expect(parsedDate.getTime()).not.toBeNaN();
  });

  it('should return 404 for an invalid route', async () => {
    const response = await request(app).get('/api/invalid-route-xyz');
    
    // Verify status code is 404 Not Found
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body.message).toContain("Can't find /api/invalid-route-xyz");
  });
});
