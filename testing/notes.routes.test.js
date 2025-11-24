const request = require('supertest');
const app = require('server.js'); 
const mongoose = require('mongoose');

describe('Notes Routes', () => {
  let createdNoteId;

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // GET /notes

  it('should get all notes', async () => {
    const res = await request(app).get('/notes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // POST /notes

  it('should create a note', async () => {
    const newNote = {
      title: 'Test Note',
      content: 'This is a test note'
    };

    const res = await request(app)
      .post('/notes')
      .send(newNote);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newNote.title);

    createdNoteId = res.body._id;
  });

  //  GET /notes/:id

  it('should get a note by id', async () => {
    const res = await request(app).get(`/notes/${createdNoteId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdNoteId);
  });

  // PUT /notes/:id

  it('should update a note', async () => {
    const updates = {
      title: 'Updated Note Title'
    };

    const res = await request(app)
      .put(`/notes/${createdNoteId}`)
      .send(updates);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updates.title);
  });

  // DELETE /notes/:id

  it('should delete a note', async () => {
    const res = await request(app).delete(`/notes/${createdNoteId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});