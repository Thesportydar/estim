var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController');

//router.get('/', gameController.readIndex);
router.get('/search', indexController.gameSearch);
router.get('/categories', indexController.getCategories);
router.get('/genres', indexController.getGenres);
router.get('/steamspy_tags', indexController.getSteamSpyTags);
router.get('/initSearch', indexController.initSearch);
//router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
//});
router.get('/initMain', indexController.readIndex);
module.exports = router;
