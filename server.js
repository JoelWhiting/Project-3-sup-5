const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
const Content = require('./models/Content');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/express-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.error(err));

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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
