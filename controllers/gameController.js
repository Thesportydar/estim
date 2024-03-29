const { model } = require("mongoose");
const { Game, Review } = require("../models");

module.exports.gameCreate = async (req, res) => {
    try {
        var lastAppid = await Game.find().sort({"appid": -1}).limit(1);
        var appid = 0;
        if (lastAppid){
            appid = lastAppid[0].appid + 1;
        }
        req.body.appid = appid;
        game = await Game.create(req.body);
        console.log(game);
        game.save();
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.gameReadOne = async (req, res) => {
    try {
        if (req.params && req.params.appid){
            var appid = req.params.appid;
            var game = await Game.findOne({"appid": appid});
            console.log(game);

            if (game){
                res.status(200).json(game);
            } else {
                res.status(404).json({"message": "Game not found"});
            }
        } else {
            res.status(400).json({"message": "No hay parametro de busqueda"});
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.gameDeleteOne = async (req, res) => {
    try {
        if (req.params && req.params.appid){
            var appid = req.params.appid;
            const game = await Game.deleteOne({"appid": appid});

            if (game.deletedCount > 0){
                res.status(200).json(game);
            } else {
                res.status(404).json({"message": "Game not found"});
            }
        } else {
            res.status(400).json({"message": "No hay parametro de busqueda"});
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.gameUpdateOne = async (req, res) => {
    try {
        if (req.params && req.params.appid){
            var appid = req.params.appid;
            const game = await Game.updateOne({"appid":appid}, { $set: req.body });

            if (game.modifiedCount > 0){
                res.status(200).json(game);
            } else {
                res.status(404).json({"message": "Game not found"});
            }
        } else {
            res.status(400).json({"message": "No hay parametro de busqueda"});
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.reviewsReadAll = async (req, res) => {
    try {
        if (req.params && req.params.appid){
            var appid = req.params.appid;
            var reviews = await Review.find({"appid": appid}).limit(20);

            if (reviews){
                res.status(200).json(reviews);
            } else {
                res.status(404).json({"message": "Reviews not found"});
            }
        } else {
            res.status(400).json({"message": "No hay parametro de busqueda"});
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.reviewsReadOne = async (req, res) => {
    try {
        if (req.params && req.params.appid && req.params.review_id){
            var appid = req.params.appid;
            var review_id = req.params.review_id;
            var review = await Review.findOne({"appid": appid, "review_id": review_id});

            if (review){
                re
                res.status(200).json(review);
            } else {
                res.status(404).json({"message": "Review not found"});
            }
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}

module.exports.reviewsPublish = async (req, res) => {
    try {
        if (req.params && req.params.appid){
            var appid = req.params.appid;
            // get the last review_id
            var lastReview = await Review.findOne({"appid": appid}).sort({"review_id": -1});
            var review_id = 0;
            if (lastReview){
                review_id = lastReview.review_id + 1;
            }
            // made a review with appid, review_id, and the everything else in the body
            var review = await Review.create({"appid": appid, "review_id": review_id, ...req.body});
            review.save();
            res.status(200).json(review);
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}

module.exports.reviewsDeleteOne = async (req, res) => {
    try {
        if (req.params && req.params.appid && req.params.review_id){
            var appid = req.params.appid;
            var review_id = req.params.review_id;
            var review = await Review.deleteOne({"appid": appid, "review_id": review_id});

            if (review.deletedCount > 0){
                res.status(200).json(review);
            } else {
                res.status(404).json({"message": "Review not found"});
            }
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}