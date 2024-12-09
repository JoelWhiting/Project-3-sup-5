const mongoose = require('mongoose');

/**
 * @typedef {Object} Content
 * @property {string} content - The content to be stored.
 * @property {Date} timestamp - The date and time when the content was created. Defaults to the current date and time.
 */

/**
 * Mongoose schema for storing content.
 * @constructor Content
 */
const contentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Content', contentSchema);
