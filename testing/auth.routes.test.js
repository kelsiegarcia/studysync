const request = require('supertest');
const app = require('../server.js'); 
const mongodb = require('../db/connect');

jest.mock('../middleware/ensureAuth', () => (req, res, next) => next());

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

describe('Auth Routes', () => {
  test('GET /auth/login-failure should return 401', async () => {
    const res = await request(app).get('/auth/login-failure');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Failed to authenticate' });
  });

  test('GET /auth/logout should return 200 and logout message', async () => {
    const res = await request(app).get('/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Logged out' });
  });

  test('GET /auth/google should redirect to google', async () => {
    const res = await request(app).get('/auth/google');
    expect(res.status).toBe(302);
    expect(res.header.location).toContain('accounts.google.com');
  });
});