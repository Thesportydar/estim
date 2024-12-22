const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    appid: Number,
    name: String,
    release_date: Date,
    developer: [String],
    publisher: [String],
    platforms: [String],
    short_description: String,
    detailed_description: String,
    categories: [String],
    genres: [String],
    steamspy_tags: [String],
    average_playtime: Number,
    positive_ratings: Number,
    negative_ratings: Number,
    total_ratings: Number,
    diff_ratings: Number,
    owners: Number,
    price: Number,
    header_image: String,
    required_age: Number,
    pc_requirements: {
        minimum: String,
        recommended: String
    },
    mac_requirements: {
        minimum: String,
        recommended: String
    },
    linux_requirements: {
        minimum: String,
        recommended: String
    },
    screenshots: [{
        id: Number,
        path_thumbnail: String,
        path_full: String
    }]
});
    
module.exports = mongoose.model('Game', gameSchema);
