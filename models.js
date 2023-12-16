const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//crear el schema con el formato que tendrán los juegos
const gameSchema = new Schema({
    appid: Number,
    name: String,
    release_date: Date,
    developer: [String],
    publisher: [String],
    platforms: [String],
    categories: [String],
    genres: [String],
    steamspy_tags: [String],
    average_playtime: Number,
    positive_ratings: Number,
    negative_ratings: Number,
    total_ratings: Number,
    diff_ratings: Number,
    owners: Number,
    price: Number
});
    
const Game = mongoose.model('Game', gameSchema);

const reviewSchema = new Schema({
    review_id: Number,
    appid: Number,
    name: String,
    recommended: Boolean,
    date: Date,
    title: String,
    text: String,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Game, Review };
