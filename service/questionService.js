
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema({

    category: String,
    question: String,
    answer: String,
    status: { type: String, lowercase: true },
    author: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('questions',QuestionSchema);