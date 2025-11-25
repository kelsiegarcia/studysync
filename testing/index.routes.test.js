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

describe('Index Routes', () => {
  test('GET / should return Hello from Express!', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Hello from Express!');
  });
});
