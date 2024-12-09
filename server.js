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
 * @returns {Promise<void>} - Resolves when the connection is successful.
 */
const connectDB = (uri) => {
    return mongoose.connect(uri)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.error('MongoDB Connection Error:', err));
};

/**
 * POST endpoint to handle content input.
 * @route POST /
 * @param {Object} req - Express request object.
 * @param {Object} req.body - JSON body containing the 'content' field.
 * @param {string} req.body.content - The content to save to a file and database.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with the 'content' field or an error message.
 */
app.post('/', async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content field is required' });
    }

    try {
        fs.writeFileSync('output.txt', content);
        const newContent = new Content({ content });
        await newContent.save();
        res.status(200).json({ content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * Start the Express server and connect to the database if not in test mode.
 */
if (process.env.NODE_ENV !== 'test') {
    connectDB('mongodb://localhost:27017/express-db').then(() => {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    });
}

module.exports = { app, connectDB };
