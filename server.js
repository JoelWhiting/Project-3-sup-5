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
 * @returns {Promise<void>} - A promise that resolves when the connection is successful.
 */
mongoose.connect('mongodb://localhost:27017/express-db')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

/**
 * POST endpoint to handle content input.
 * @route POST /
 * @param {Object} req - Express request object.
 * @param {Object} req.body - JSON body containing 'content' field.
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
 * Start the server and listen on the specified port.
 */
const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = { app, server };
