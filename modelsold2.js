const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//crear el schema con el formato que tendrán los juegos
const gameSchema = new Schema({
        appid: Number,
        name: String,
        release_date: { type: Date, default: Date.now, timezone: "America/Argentina" },
        average_playtime: Number,
        price: Number
    });

const Game = mongoose.model('Prueba', gameSchema);

module.exports = { Game };
