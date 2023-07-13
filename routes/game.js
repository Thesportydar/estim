var express = require('express');
var router = express.Router();
var gameController = require('../controllers/gameController');

router.post('/', gameController.gameCreate);
router.get('/:appid', gameController.gameReadOne);
router.put('/:appid', gameController.gameUpdateOne);
router.delete('/:appid', gameController.gameDeleteOne);

module.exports = router;
