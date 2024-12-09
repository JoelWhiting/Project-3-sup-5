const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
const Content = require('./models/Content');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

/**
 * Connect to MongoDB database.
 * @function connectDB
 * @param {string} uri - MongoDB connection string.
 * @returns {Promise<void>} Resolves when the connection is successfully established.
 */
const connectDB = (uri) => {
    return mongoose.connect(uri)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.error('MongoDB Connection Error:', err));
};

/**
 * POST endpoint to handle content input.
 * - Writes the content to a file.
 * - Saves the content to MongoDB.
 * @route POST /
 * @param {Object} req - Express request object.
 * @param {Object} req.body - JSON payload containing the `content` field.
 * @param {string} req.body.content - The content to be saved.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing the saved `content` or an error message.
 */
app.post('/', async (req, res) => {
    const { content } = req.body;

    console.log('Received payload:', req.body); // Debug log

    if (!content) {
        return res.status(400).json({ message: 'Content field is required' });
    }

    try {
        // Write content to a file
        fs.writeFileSync('output.txt', content);

        // Save content to the database
        const newContent = new Content({ content });
        const savedContent = await newContent.save();
        console.log('Content saved to database:', savedContent); // Debug log

        res.status(200).json({ content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * Start the server only if the file is run directly (not imported).
 * Ensures no duplicate server starts when imported for testing or integration.
 */
if (require.main === module) {
    connectDB('mongodb://localhost:27017/express-main-db').then(() => {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    });
}

module.exports = { app, connectDB };
