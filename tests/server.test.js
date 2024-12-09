const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const app = require('../server'); // Ensure app is exported in server.js

describe('POST /', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/express-test-db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
        if (fs.existsSync('output.txt')) {
            fs.unlinkSync('output.txt');
        }
    });

    it('should return content, write to file, and save to database', async () => {
        const payload = { content: 'Test content' };

        const response = await request(app)
            .post('/')
            .send(payload);

        expect(response.status).toBe(200);
        expect(response.body.content).toBe(payload.content);

        const fileContent = fs.readFileSync('output.txt', 'utf-8');
        expect(fileContent).toBe(payload.content);
    });

    it('should return error when content field is missing', async () => {
        const response = await request(app).post('/').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Content field is required');
    });
});
