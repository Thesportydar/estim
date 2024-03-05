const { Game, Review } = require("../models");

module.exports.gameSearch = async (req, res) => {
    try {
        const filters = {};

        propertyName = req.query.propertyName;
        const paginaActual = parseInt(req.query.page) || 1;
        const resultadosPorPagina = req.query.limit;
        const salto = (paginaActual - 1) * resultadosPorPagina;

        if (req.query.name) {
            filters.name = { "$regex": req.query.name, "$options": "i" }
        }
        if (req.query.categories && req.query.categories.length > 0) {
            filters.categories = { "$all": req.query.categories }
        }
        if (req.query.genres && req.query.genres.length > 0) {
            filters.genres = { "$all": req.query.genres }
        }
        if (req.query.tags && req.query.tags.length > 0) {
            filters.steamspy_tags = { "$all": req.query.tags }
        }
        if (req.query.publisher) {
            filters.publisher = { "$regex": "^" + req.query.publisher, "$options": "i" }
        }
        if (req.query.minPrice && req.query.maxPrice) {
            filters.price = { "$gte": req.query.minPrice, "$lte": req.query.maxPrice }
        }
        console.log(filters);

        const cantidadResultados = await Game.countDocuments(filters);

        let games;
        if (req.query.reverse === "false" ) {
            games = await Game.find(filters).skip(salto).limit(resultadosPorPagina).sort({[propertyName]: 1});
        } else {
            games = await Game.find(filters).skip(salto).limit(resultadosPorPagina).sort({[propertyName]: -1});
        }
        res.status(200).json({games, cantidadResultados, paginaActual});
    } catch (error) {
        res.status(404).json(error);
    }
}

module.exports.readIndex = async (req, res) => {
    try {
        const projection = 'appid name header_image short_description price'

        const mostPlayed = await Game.find({ price: { $gt: 0 }, release_date: { $gte: new Date('2015-01-01') } }).sort({ average_playtime: -1 }).limit(5).select(projection);
        const mostLikes = await Game.find({ price: { $gt: 0 }, release_date: { $gte: new Date('2015-01-01') } }).sort({ diff_ratings: -1 }).limit(5).select(projection);
        const mostSold = await Game.find({ price: { $gt: 0 }, release_date: { $gte: new Date('2015-01-01') } }).sort({ owners: -1 }).limit(5).select(projection);

        // Concatenar y eliminar duplicados por appid
        const uniqueAppIds = new Set();
        const recomendacion = [...mostPlayed, ...mostLikes, ...mostSold].filter(game => {
            if (!uniqueAppIds.has(game.appid)) {
                uniqueAppIds.add(game.appid);
                return true;
            }
            return false;
        });

        const free_to_play = await Game.find({ price: { $eq: 0 } }).sort({ average_playtime: -1 }).limit(10).select(projection);

        const rta = {
            recomendacion,
            free_to_play
        }

        res.status(200).json(rta);
    } catch (error) {
        res.status(404).json(error);
    }
}

const getCategories = async () => {
    const categories = await Game.distinct("categories");
    return categories;
}

const getGenres = async () => {
    const genres = await Game.distinct("genres");
    return genres;
}

const getSteamSpyTags = async () => {
    const tags = await Game.distinct("steamspy_tags");
    return tags;
}

const getMaxPrice = async () => {
    const maxPrice = await Game.find().sort({ price: -1 }).limit(1);
    return maxPrice[0].price;
}

module.exports.initSearch = async (req, res) => {
    try {
        const categories = await getCategories();
        const genres = await getGenres();
        const tags = await getSteamSpyTags();
        const maxPrice = await getMaxPrice();
        const minPrice = 0;
        const reverse = false;
        const propertyName = req.query.propertyName;
        const json = {
            categories,
            genres,
            tags,
            minPrice,
            maxPrice,
            reverse,
            propertyName
        }
        res.status(200).json(json);
    } catch (error) {
        res.status(404).json(error);
    }
}

module.exports.getCategories = async (req, res) => {
    try {
        const categories = await getCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(404).json(error);
    }
}

module.exports.getGenres = async (req, res) => {
    try {
        const genres = await getGenres();
        res.status(200).json(genres);
    } catch (error) {
        res.status(404).json(error);
    }
}

module.exports.getSteamSpyTags = async (req, res) => {
    try {
        const tags = await getSteamSpyTags();
        res.status(200).json(tags);
    } catch (error) {
        res.status(404).json(error);
    }
}