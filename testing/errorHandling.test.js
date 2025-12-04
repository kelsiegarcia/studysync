const request = require('supertest');
const app = require('../server.js');
const mongodb = require('../db/connect');

// Mock authentication middleware
jest.mock('../middleware/ensureAuth', () => (req, res, next) => {
  req.user = { _id: 'mock-user-id' };
  next();
});

// Mock the database connection
jest.mock('../db/connect');

describe('Error Handling Tests', () => {
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

  describe('404 Not Found Errors', () => {
    test('GET /users/:id should return 404 if user not found', async () => {
      const validId = '507f1f77bcf86cd799439011';
      mockCollection.findOne.mockResolvedValue(null); // Simulate not found

      const res = await request(app).get(`/users/${validId}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'User not found' });
    });

    test('DELETE /users/:id should return 404 if user not found', async () => {
      const validId = '507f1f77bcf86cd799439011';
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 }); // Simulate not found

      const res = await request(app).delete(`/users/${validId}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'User not found' });
    });

    test('GET /sessions/:id should return 404 if session not found', async () => {
      const validId = '507f1f77bcf86cd799439011';
      mockCollection.findOne.mockResolvedValue(null);

      const res = await request(app).get(`/sessions/${validId}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Session not found' });
    });

    test('PUT /sessions/:id should return 404 if session not found', async () => {
      const validId = '507f1f77bcf86cd799439011';
      mockCollection.updateOne.mockResolvedValue({ matchedCount: 0 });

      const res = await request(app)
        .put(`/sessions/${validId}`)
        .send({ topic: 'New Topic' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Session not found' });
    });
  });

  describe('500 Server Errors', () => {
    test('GET /users should return 500 if database fails', async () => {
      mockCollection.toArray.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/users');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to get users', details: {} });
    });

    test('GET /users/:id should return 500 if database fails', async () => {
      const validId = '507f1f77bcf86cd799439011';
      mockCollection.findOne.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get(`/users/${validId}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Server error retrieving user' });
    });

    test('POST /sessions should return 500 if database fails', async () => {
      mockCollection.insertOne.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/sessions')
        .send({
          sessionId: '1',
          topic: 'Test',
          time: '10:00',
          participants: []
        });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Server error creating session' });
    });
  });
});
