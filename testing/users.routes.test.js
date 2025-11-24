const request = require('supertest');
const app = require('../server.js'); 
const mongodb = require('../db/connect');
const usersController = require('../controllers/user');
const { ObjectId } = require('mongodb');

// Mock authentication middleware
jest.mock('../middleware/ensureAuth', () => (req, res, next) => next());

// Mock the usersController
jest.mock('../controllers/user', () => ({
  getAllUsers: jest.fn((req, res) => res.status(200).send('getAllUsers called')),
  getUserById: jest.fn((req, res) => res.status(200).send(`getUserById called with id ${req.params.id}`)),
  deleteUser: jest.fn((req, res) => res.status(200).send(`deleteUser called with id ${req.params.id}`)),
}));

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    mongodb.initDb((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});




describe('Users Routes Integration Tests', () => {

  test('GET /users should return a list of users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // assuming getAllUsers returns array
    if (res.body.length > 0) testUserId = res.body[0]._id;
  });

  test('GET /users/:id should return a single user', async () => {
    if (!testUserId) return; // skip if no users in DB
    const res = await request(app).get(`/users/${testUserId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', testUserId);
  });

  test('DELETE /users/:id should delete a user', async () => {
    if (!testUserId) return; // skip if no users in DB
    const res = await request(app).delete(`/users/${testUserId}`);
    expect(res.status).toBe(200); // or 204 depending on your controller
  });

});
