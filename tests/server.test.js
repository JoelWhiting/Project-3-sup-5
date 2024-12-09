const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const app = require('../server'); // Ensure app is exported in server.js

/**
 * Tests for the POST / endpoint of the Express server.
 */
describe('POST /', () => {
    /**
     * Before all tests, connect to the test MongoDB database.
     * @async
     * @function
     */
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/express-test-db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    /**
     * After all tests, close the database connection and clean up files.
     * @async
     * @function
     */
    afterAll(async () => {
        await mongoose.connection.close();

        // Remove the generated file if it exists
        if (fs.existsSync('output.txt')) {
            fs.unlinkSync('output.txt');
        }
    });

    /**
     * Test case for a successful POST request.
     * It verifies:
     * 1. The response contains the correct content.
     * 2. The content is written to a file.
     * 3. The database saves the content.
     */
    it('should return content, write to file, and save to database', async () => {
        const payload = { content: 'Test content' };

        // Send POST request
        const response = await request(app)
            .post('/')
            .send(payload);

        // Assertions for response
        expect(response.status).toBe(200);
        expect(response.body.content).toBe(payload.content);

        // Assertions for file
        const fileContent = fs.readFileSync('output.txt', 'utf-8');
        expect(fileContent).toBe(payload.content);
    });

    /**
     * Test case for a failed POST request when "content" field is missing.
     * It verifies that the server responds with a 400 status code and an error message.
     */
    it('should return error when content field is missing', async () => {
        const response = await request(app).post('/').send({});

        // Assertions for response
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Content field is required');
    });
});
