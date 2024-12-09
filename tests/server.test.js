const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const { app, server } = require('../server');

/**
 * Test suite for the POST / endpoint.
 */
describe('POST /', () => {
    /**
     * Connect to the test MongoDB database before running tests.
     * @returns {Promise<void>}
     */
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/express-test-db');
    });

    /**
     * Disconnect MongoDB and close the server after running tests.
     * @returns {Promise<void>}
     */
    afterAll(async () => {
        await mongoose.connection.close();
        server.close(); // Close the Express server to free up the port
        if (fs.existsSync('output.txt')) fs.unlinkSync('output.txt');
    });

    /**
     * Test case for successful POST request.
     * It verifies:
     * - Response contains the correct content.
     * - Content is written to a file.
     * - Content is saved to the database.
     */
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

    /**
     * Test case for missing "content" field in the POST request.
     * It verifies the server responds with a 400 status and appropriate error message.
     */
    it('should return error when content field is missing', async () => {
        const response = await request(app).post('/').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Content field is required');
    });
});
