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


let createdNoteId;

describe('Notes Routes', () => {
  it('should create a note', async () => {
    const newNote = { title: 'Test Note', content: 'This is a test' };

    const res = await request(app)
      .post('/notes')
      .send(newNote);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('insertedId'); 
    
    createdNoteId = res.body.insertedId;
  });

  it('should get a note by id', async () => {
    const res = await request(app).get(`/notes/${createdNoteId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdNoteId); 
  });

  it('should update a note', async () => {
    const updates = { title: 'Updated Note' };

    const res = await request(app)
      .put(`/notes/${createdNoteId}`)
      .send(updates);

    expect(res.statusCode).toBe(204);
   
  });

  it('should delete a note', async () => {
    const res = await request(app).delete(`/notes/${createdNoteId}`);

    expect(res.statusCode).toBe(204);
  });
});