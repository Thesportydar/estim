const { Game, Review } = require("../models");

module.exports.gameCreate = async (req, res) => {
    try {
        var game = await Game.find({"appid": req.body.appid});

        if (game.length > 0){
            res.status(401).json({message: "Game already exists"});
        } else {
            console.log(req.body);
            game = await Game.create(req.body);
            //game = await new Game({
            //"appid": 70,
            //"name": "Half-Life",
            //"release_date": new Date("1998-11-08T00:00:00.000Z"),
            //"average_playtime": 1300,
            //"price": 227.49
            //});
            //game = await Game.create({
                //appid: 50,
                //name: "atun",
                //release_date: new Date(Date.now()),
                //average_playtime: 100,
                //price: 100000
            //});
            console.log(game);
            game.save();
            res.status(200).json(game);
        }
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
            const game = await Game.updateOne({"appid":appid}, req.body);

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