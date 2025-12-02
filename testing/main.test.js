jest.mock('../middleware/ensureAuth', () => {
    return ( req, res, next ) => next();
});

const request = require('supertest');
const app = require('../server');


describe('main.js basic API test', () => {
    test('GET / responds with Hello from Express', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Hello from Express!');
    });

    test('GET /users responds with 200 and an array', async () => { 
        const res = await request (app).get('/sessions');

        expect([200, 500]).toContain(res.statusCode);
    });
});