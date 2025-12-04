const request = require('supertest');
const app = require('../server.js');
const mongodb = require('../db/connect');

// Mock authentication middleware
jest.mock('../middleware/ensureAuth', () => (req, res, next) => {
  req.user = { _id: 'mock-user-id' }; // Mock user for authenticated routes
  next();
});

// Mock the database connection
jest.mock('../db/connect');

describe('Data Validation Tests', () => {
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    mongodb.getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Session Validation', () => {
    test('POST /sessions should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/sessions')
        .send({
          // Missing sessionId, topic, time, participants
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing required session fields' });
    });

    test('PUT /sessions/:id should return 400 if no fields are provided to update', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/sessions/${validId}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'No fields provided to update' });
    });
    
    test('GET /sessions/:id should return 400 for invalid ID format', async () => {
        const invalidId = 'invalid-id';
        const res = await request(app).get(`/sessions/${invalidId}`);
  
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid ID format' });
      });
  });

  describe('Note Validation', () => {
    test('PUT /notes/:id should return 400 if required fields are missing', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/notes/${validId}`)
        .send({
            // Missing fields
            content: 'Some content'
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing required fields' });
    });

    test('GET /notes/:id should return 400 for invalid ID format', async () => {
      const invalidId = 'invalid-id';
      const res = await request(app).get(`/notes/${invalidId}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid ID format' });
    });
  });

  describe('User Validation', () => {
    test('GET /users/:id should return 400 for invalid ID format', async () => {
      const invalidId = 'invalid-id';
      const res = await request(app).get(`/users/${invalidId}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid ID format' });
    });
  });
});
