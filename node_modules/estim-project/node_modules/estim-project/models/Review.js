const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    review_id: Number,
    appid: Number,
    name: String,
    recommend: Boolean,
    date: Date,
    title: String,
    text: String,
});

module.exports = mongoose.model('Review', reviewSchema);
