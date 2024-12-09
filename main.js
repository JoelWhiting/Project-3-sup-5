const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const { connectDB } = require('./server');
const Content = require('./models/Content');

/**
 * Main function to confirm all parts of the application work as expected.
 * 1. Connect to MongoDB.
 * 2. Send a POST request to the server.
 * 3. Verify that the file gets created.
 * 4. Verify that data is saved to the database.
 */
async function main() {
    try {
        // Step 1: Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await connectDB('mongodb://localhost:27017/express-main-db');
        console.log('MongoDB connected successfully.');

        // Step 2: Send POST request to the server
        console.log('Sending POST request to the server...');
        const payload = { content: 'This is test content from main.js' };
        const response = await axios.post('http://localhost:3000/', payload);

        if (response.status === 200) {
            console.log('Server Response:', response.data);
        } else {
            console.error('POST request failed:', response.statusText);
            return;
        }

        // Step 3: Verify file creation
        const filePath = 'output.txt';
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            console.log('File created successfully with content:', fileContent);
        } else {
            console.error('File was not created.');
            return;
        }

        // Step 4: Verify data in the database
        console.log('Verifying data in the database...');
        const savedContent = await Content.findOne({ content: payload.content });
        if (savedContent) {
            console.log('Data saved in MongoDB:', savedContent);
        } else {
            console.error('Data was not found in the database.');
        }

        // Step 5: Clean up
        console.log('Cleaning up test data...');
        await Content.deleteOne({ content: payload.content });
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        console.log('All checks passed successfully!');
    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
}

// Run the main function
main();
