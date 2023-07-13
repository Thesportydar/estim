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
        price: Number
    });

const Game = mongoose.model('Game', gameSchema);

module.exports = { Game };
