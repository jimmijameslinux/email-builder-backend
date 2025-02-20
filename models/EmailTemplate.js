const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    footer: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);