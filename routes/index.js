var express = require('express');
var router = express.Router();
var gameController = require('../controllers/indexController');

//router.get('/', gameController.readIndex);
router.get('/search', gameController.gameSearch);
router.get('/categories', gameController.getCategories);
router.get('/genres', gameController.getGenres);
router.get('/steamspytags', gameController.getSteamSpyTags);
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
module.exports = router;
