var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController');

//router.get('/', gameController.readIndex);
router.get('/search', indexController.gameSearch);
router.get('/categories', indexController.getCategories);
router.get('/genres', indexController.getGenres);
//router.get('/steamspytags', gameController.getSteamSpyTags);
router.get('/initSearch', indexController.initSearch);
//router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
//});
module.exports = router;
