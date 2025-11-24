const request = require('supertest');
const app = require('../server.js'); 
const mongoose = require('mongoose');
const mongodb = require('../db/connect');

jest.mock('../middleware/ensureAuth', () => (req, res, next) => next());


beforeAll((done) => {
  mongodb.initDb((err) => {
    if (err) return done(err);
    done();
  });
});
