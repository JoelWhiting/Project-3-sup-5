const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Content', contentSchema);
