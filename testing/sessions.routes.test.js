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


describe('Session Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /sessions calls getAll', async () => {
    SessionController.getAll.mockImplementation((req, res) => res.status(200).json({ msg: 'getAll called' }));

    const res = await request(app).get('/sessions');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'getAll called' });
    expect(SessionController.getAll).toHaveBeenCalled();
  });

  test('GET /sessions/:id calls getSingle', async () => {
    SessionController.getSingle.mockImplementation((req, res) =>
      res.status(200).json({ msg: `getSingle ${req.params.id} called` })
    );

    const res = await request(app).get('/sessions/123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'getSingle 123 called' });
    expect(SessionController.getSingle).toHaveBeenCalled();
  });

  test('POST /sessions calls createSession', async () => {
    SessionController.createSession.mockImplementation((req, res) =>
      res.status(201).json({ msg: 'createSession called', data: req.body })
    );

    const res = await request(app).post('/sessions').send({ name: 'Test Session' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ msg: 'createSession called', data: { name: 'Test Session' } });
    expect(SessionController.createSession).toHaveBeenCalled();
  });

  test('PUT /sessions/:id calls updateSession', async () => {
    SessionController.updateSession.mockImplementation((req, res) =>
      res.status(200).json({ msg: `updateSession ${req.params.id} called`, data: req.body })
    );

    const res = await request(app).put('/sessions/123').send({ name: 'Updated Session' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'updateSession 123 called', data: { name: 'Updated Session' } });
    expect(SessionController.updateSession).toHaveBeenCalled();
  });

  test('DELETE /sessions/:id calls deleteSession', async () => {
    SessionController.deleteSession.mockImplementation((req, res) =>
      res.status(200).json({ msg: `deleteSession ${req.params.id} called` })
    );

    const res = await request(app).delete('/sessions/123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'deleteSession 123 called' });
    expect(SessionController.deleteSession).toHaveBeenCalled();
  });
});