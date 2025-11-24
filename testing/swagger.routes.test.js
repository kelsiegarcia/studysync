const request = require('supertest');
const app = require('../server.js'); 
const mongoose = require('mongoose');
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

const { ObjectId } = require('mongodb');


beforeEach(() => {
  app.use((req, res, next) => {
    req.user = { _id: new ObjectId() }; 
    next();
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

test('dummy test', () => {
  expect(true).toBe(true);
});