const { Game } = require("../models");

module.exports.gameSearch = async (req, res) => {
    try {
        const filters = {};
        if (req.query.name) {
            filters.name = { "$regex": "^"+req.query.name}
        }
        if (req.query.categories && req.query.categories.length > 0) {
            filters.categories = { "$all": req.query.categories }
        }
        if (req.query.genres && req.query.genres.length > 0) {
            filters.genres = { "$all": req.query.genres }
        }
        if (req.query.tags && req.query.tags.length > 0) {
            filters.tags = { "$all": req.query.tags }
        }
        console.log(filters);
        const game = await Game.find(filters).limit(200);
        res.status(200).json(game);
    } catch (error) {
        res.status(404).json(error);
    }
}

module.exports.readIndex = async (req, res) => {
    try {
        const mostPlayed = await Game.find().sort({ average_playtime: -1 }).limit(10);
        const recentlyReleased = await Game.find().sort({ release_date: -1 }).limit(10);

        const mostUbisoftGamesPlayed = await Game.find({ publisher: "Ubisoft" }).sort({ average_playtime: -1 }).limit(10);
        const mostValveGamesPlayed = await Game.find({ publisher: "Valve" }).sort({ average_playtime: -1 }).limit(10);

        const mostActionPlayed = await Game.find({ genres: "Action" }).sort({ average_playtime: -1 }).limit(10);
        const mostSportsPlayed = await Game.find({ genres: "Sports" }).sort({ average_playtime: -1 }).limit(10);

        const json = {
            mostPlayed,
            recentlyReleased,
            mostUbisoftGamesPlayed,
            mostValveGamesPlayed,
            mostActionPlayed,
            mostSportsPlayed
        }
        res.status(200).json(json);
    } catch (error) {
        res.status(404).json(error);
    }
}

module.exports.getCategories = async (req, res) => {
    try {
        const categories = await Game.distinct("categories");
        res.status(200).json(categories);
    } catch (error) {
        res.status(404).json(error);
    }
}
module.exports.getGenres = async (req, res) => {
    try {
        const genres = await Game.distinct("genres");
        res.status(200).json(genres);
    } catch (error) {
        res.status(404).json(error);
    }
}
module.exports.getSteamSpyTags = async (req, res) => {
    try {
        const tags = await Game.distinct("steamspy_tags");
        res.status(200).json(tags);
    } catch (error) {
        res.status(404).json(error);
    }
}
