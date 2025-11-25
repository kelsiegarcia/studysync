const request = require('supertest');
const app = require('../server.js'); 
const mongodb = require('../db/connect');

// Mock authentication middleware
jest.mock('../middleware/ensureAuth', () => (req, res, next) => next());

// Mock the usersController
jest.mock('../controllers/user', () => ({
  getAllUsers: jest.fn((req, res) => res.status(200).json({ msg: 'getAllUsers called' })),
  getUserById: jest.fn((req, res) => res.status(200).json({ msg: `getUserById called with id ${req.params.id}` })),
  deleteUser: jest.fn((req, res) => res.status(200).json({ msg: `deleteUser called with id ${req.params.id}` })),
}));

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    mongodb.initDb((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

afterAll(() => {
  mongodb.closeDb();
});

describe('Users Routes Integration Tests', () => {

  test('GET /users should return a list of users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ msg: 'getAllUsers called' });
  });

  test('GET /users/:id should return a single user', async () => {
    const res = await request(app).get('/users/123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ msg: 'getUserById called with id 123' });
  });

  test('DELETE /users/:id should delete a user', async () => {
    const res = await request(app).delete('/users/123');
    expect(res.status).toBe(200); 
    expect(res.body).toEqual({ msg: 'deleteUser called with id 123' });
  });

});
