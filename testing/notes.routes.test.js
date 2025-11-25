const request = require('supertest');
const app = require('../server.js'); 
const mongodb = require('../db/connect');

// Mock authentication middleware
jest.mock('../middleware/ensureAuth', () => (req, res, next) => next());

// Mock the note controller
jest.mock('../controllers/note', () => ({
  getAll: jest.fn((req, res) => res.status(200).json({ msg: 'getAll called' })),
  getSingle: jest.fn((req, res) => res.status(200).json({ msg: `getSingle ${req.params.id} called` })),
  createNote: jest.fn((req, res) => res.status(201).json({ msg: 'createNote called', data: req.body })),
  updateNote: jest.fn((req, res) => res.status(200).json({ msg: `updateNote ${req.params.id} called`, data: req.body })),
  deleteNote: jest.fn((req, res) => res.status(200).json({ msg: `deleteNote ${req.params.id} called` })),
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

describe('Notes Routes', () => {
  test('GET /notes calls getAll', async () => {
    const res = await request(app).get('/notes');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'getAll called' });
  });

  test('GET /notes/:id calls getSingle', async () => {
    const res = await request(app).get('/notes/123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'getSingle 123 called' });
  });

  test('POST /notes calls createNote', async () => {
    const newNote = { title: 'Test Note', content: 'This is a test' };
    const res = await request(app).post('/notes').send(newNote);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ msg: 'createNote called', data: newNote });
  });

  test('PUT /notes/:id calls updateNote', async () => {
    const updates = { title: 'Updated Note' };
    const res = await request(app).put('/notes/123').send(updates);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'updateNote 123 called', data: updates });
  });

  test('DELETE /notes/:id calls deleteNote', async () => {
    const res = await request(app).delete('/notes/123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'deleteNote 123 called' });
  });
});