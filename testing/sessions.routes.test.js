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