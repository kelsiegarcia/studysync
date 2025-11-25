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

describe('Swagger Routes', () => {
  test('GET /api-docs/ should return 200 and HTML content', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<!DOCTYPE html>');
  });
});