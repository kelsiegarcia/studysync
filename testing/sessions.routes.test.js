const request = require('supertest');
const app = require('../server.js'); 
const mongodb = require('../db/connect');

// Mock authentication middleware
jest.mock('../middleware/ensureAuth', () => (req, res, next) => next());

// Mock the session controller
jest.mock('../controllers/session', () => ({
  getAll: jest.fn((req, res) => res.status(200).json({ msg: 'getAll called' })),
  getSingle: jest.fn((req, res) => res.status(200).json({ msg: `getSingle ${req.params.id} called` })),
  createSession: jest.fn((req, res) => res.status(201).json({ msg: 'createSession called', data: req.body })),
  updateSession: jest.fn((req, res) => res.status(200).json({ msg: `updateSession ${req.params.id} called`, data: req.body })),
  deleteSession: jest.fn((req, res) => res.status(200).json({ msg: `deleteSession ${req.params.id} called` })),
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

describe('Session Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /sessions calls getAll', async () => {
  
    const res = await request(app).get('/sessions');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'getAll called' });
    
  });

  test('GET /sessions/:id calls getSingle', async () => {
  
    const res = await request(app).get('/sessions/123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'getSingle 123 called' });
    
  });

  test('POST /sessions calls createSession', async () => {
 

    const res = await request(app).post('/sessions').send({ name: 'Test Session' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ msg: 'createSession called', data: { name: 'Test Session' } });
  
  });

  test('PUT /sessions/:id calls updateSession', async () => {


    const res = await request(app).put('/sessions/123').send({ name: 'Updated Session' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'updateSession 123 called', data: { name: 'Updated Session' } });
    
  });

  test('DELETE /sessions/:id calls deleteSession', async () => {
  

    const res = await request(app).delete('/sessions/123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'deleteSession 123 called' });
   
  });
});