const request = require('supertest');
const app = require('./server.js');

describe('Job API Tests', () => {

    test('GET /health - should return healthy status', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('healthy');
    });

    test('GET /api/jobs - should return all jobs', async () => {
        const response = await request(app).get('/api/jobs');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.count).toBeGreaterThan(0);
    });

    test('GET /api/jobs/:id - should return single job', async () => {
        const response = await request(app).get('/api/jobs/1');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(1);
    });

    test('GET /api/jobs/:id - should return single job with correct structure', async () => {
      const response = await request(app).get('/api/jobs/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Struktur-Tests
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title');
      expect(typeof response.body.data.title).toBe('string');
      expect(response.body.data.title).toBe('Frontend Developer');
      expect(response.body.data).toHaveProperty('company');
      expect(response.body.data.company).toBe('Tech GmbH');
      expect(response.body.data).toHaveProperty('location');
      expect(response.body.data.location).toBe('Berlin');
      expect(response.body.data).toHaveProperty('salary');
      expect(response.body.data.salary).toBe('55.000-70.000€');
      expect(response.body.data).toHaveProperty('description');
      expect(response.body.data.description).toBe('React, TypeScript, CI/CD');
    });

    test('GET /api/jobs/:id - should return 404 for invalid id', async () => {
        const response = await request(app).get('/api/jobs/999');
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    test('POST /api/apply - should submit application', async () => {
        const application = {
            jobId: 1,
            name: 'Max Mustermann',
            email: 'max@example.com'
        };

        const response = await request(app).post('/api/apply').send(application);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('POST /api/apply - should fail without required fields', async () => {
        const response = await request(app).post('/api/apply').send({ name: 'Max' });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

});

describe('Location Filter Tests', () => {
  test('GET /api/jobs/location/:city - should return jobs in Berlin', async () => {
    const response = await request(app).get('/api/jobs/location/Berlin');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.count).toBeGreaterThan(0);
  });

  test('GET /api/jobs/location/:city - should return 404 for invalid city', async () => {
    const response = await request(app).get('/api/jobs/location/Paris');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});

describe('Application Submission - Extended Tests', () => {
  test('should accept valid application', async () => {
    const application = {
      jobId: 1,
      name: 'Max Mustermann',
      email: 'max@test.com'
    };
    const response = await request(app).post('/api/apply').send(application);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(application);
  });

  test('should reject if jobId missing', async () => {
    const response = await request(app).post('/api/apply').send({ name: 'Max', email: 'max@test.com' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should reject if name missing', async () => {
    const response = await request(app).post('/api/apply').send({ jobId: 1, email: 'max@test.com' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should reject if email missing', async () => {
    const response = await request(app).post('/api/apply').send({ jobId: 1, name: 'Max' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should reject if body is empty', async () => {
    const response = await request(app).post('/api/apply').send({});
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe('Catch-All 404 Route', () => {
  test('GET /api/unknown - should return 404 and error message', async () => {
    const response = await request(app).get('/api/unknown');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Route Not Found');
  });

  test('POST /api/unknown - should return 404 and error message', async () => {
    const response = await request(app).post('/api/unknown').send({});
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Route Not Found');
  });
});
