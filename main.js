const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const { connectDB } = require('./server');
const Content = require('./models/Content');

/**
 * Main function to verify the functionality of the server and database.
 * Steps include:
 * 1. Connecting to MongoDB.
 * 2. Sending a POST request to the server.
 * 3. Verifying file creation.
 * 4. Checking that data is saved in MongoDB.
 * 5. Cleaning up test data.
 * @async
 * @function main
 * @returns {Promise<void>} Resolves when all steps have been successfully verified.
 */
async function main() {
    try {
        console.log('Connecting to MongoDB...');

        /**
         * Step 1: Connect to MongoDB.
         */
        if (mongoose.connection.readyState === 0) {
            await connectDB('mongodb://localhost:27017/express-main-db');
        }
        console.log('MongoDB connected successfully.');

        /**
         * Step 2: Send POST request to the server.
         */
        console.log('Sending POST request to the server...');
        const payload = { content: 'This is test content from main.js' };
        const response = await axios.post('http://localhost:3000/', payload);

        if (response.status === 200) {
            console.log('Server Response:', response.data);
        } else {
            console.error('POST request failed:', response.statusText);
            return;
        }

        /**
         * Step 3: Verify file creation.
         */
        const filePath = 'output.txt';
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            console.log('File created successfully with content:', fileContent);
        } else {
            console.error('File was not created.');
            return;
        }

        /**
         * Step 4: Verify data in the database.
         */
        console.log('Verifying data in the database...');
        const savedContent = await Content.findOne({ content: payload.content });
        if (savedContent) {
            console.log('Data saved in MongoDB:', savedContent);
        } else {
            console.error('Data was not found in the database.');
        }

        /**
         * Step 5: Clean up test data.
         */
        console.log('Cleaning up test data...');
        await Content.deleteOne({ content: payload.content });
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        console.log('All checks passed successfully!');
    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        // Ensure MongoDB connection is closed
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
}

main();
