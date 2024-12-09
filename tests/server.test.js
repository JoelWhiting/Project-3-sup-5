const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const { app, connectDB } = require('../server');

/**
 * Test suite for the POST / endpoint.
 */
describe('POST /', () => {
    /**
     * Connect to the test MongoDB database before running tests.
     * @function
     * @async
     * @returns {Promise<void>} Resolves when the connection is established.
     */
    beforeAll(async () => {
        await connectDB('mongodb://localhost:27017/express-test-db');
    });

    /**
     * Disconnect the MongoDB connection and clean up resources after tests.
     * @function
     * @async
     * @returns {Promise<void>} Resolves when cleanup is complete.
     */
    afterAll(async () => {
        await mongoose.connection.close();
        if (fs.existsSync('output.txt')) {
            fs.unlinkSync('output.txt'); // Remove the test file
        }
    });

    /**
     * Test case for a successful POST request.
     * It verifies:
     * - Response contains the correct content.
     * - Content is written to a file.
     * - Content is saved in the database.
     * @function
     * @async
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
     * Test case for a failed POST request when "content" field is missing.
     * It verifies the response status and error message.
     * @function
     * @async
     */
    it('should return error when content field is missing', async () => {
        const response = await request(app)
            .post('/')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Content field is required');
    });
});
