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


describe('Progress Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /progress calls getAll', async () => {
    ProgressController.getAll.mockImplementation((req, res) => res.status(200).json({ msg: 'getAll called' }));

    const res = await request(app).get('/progress');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'getAll called' });
    expect(ProgressController.getAll).toHaveBeenCalled();
  });

  test('GET /progress/:id calls getSingle', async () => {
    ProgressController.getSingle.mockImplementation((req, res) => res.status(200).json({ msg: `getSingle ${req.params.id} called` }));

    const res = await request(app).get('/progress/123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'getSingle 123 called' });
    expect(ProgressController.getSingle).toHaveBeenCalled();
  });

  test('POST /progress calls createProgress', async () => {
    ProgressController.createProgress.mockImplementation((req, res) => res.status(201).json({ msg: 'createProgress called', data: req.body }));

    const res = await request(app).post('/progress').send({ name: 'Test Progress' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ msg: 'createProgress called', data: { name: 'Test Progress' } });
    expect(ProgressController.createProgress).toHaveBeenCalled();
  });

  test('PUT /progress/:id calls updateProgress', async () => {
    ProgressController.updateProgress.mockImplementation((req, res) => res.status(200).json({ msg: `updateProgress ${req.params.id} called`, data: req.body }));

    const res = await request(app).put('/progress/123').send({ name: 'Updated' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'updateProgress 123 called', data: { name: 'Updated' } });
    expect(ProgressController.updateProgress).toHaveBeenCalled();
  });

  test('DELETE /progress/:id calls deleteProgress', async () => {
    ProgressController.deleteProgress.mockImplementation((req, res) => res.status(200).json({ msg: `deleteProgress ${req.params.id} called` }));

    const res = await request(app).delete('/progress/123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'deleteProgress 123 called' });
    expect(ProgressController.deleteProgress).toHaveBeenCalled();
  });
});