var express = require('express');
var router = express.Router();
var gameController = require('../controllers/gameController');

router.post('/', gameController.gameCreate);
router.get('/:appid', gameController.gameReadOne);
router.put('/:appid', gameController.gameUpdateOne);
router.delete('/:appid', gameController.gameDeleteOne);
router.get('/:appid/reviews', gameController.reviewsReadAll);
router.get('/:appid/reviews/:review_id', gameController.reviewsReadOne);
router.post('/:appid/reviews', gameController.reviewsPublish);
router.delete('/:appid/reviews/:review_id', gameController.reviewsDeleteOne);

module.exports = router;
