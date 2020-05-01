var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');


router.get( '/' , indexController.main);

const dir = '/test/';

router.get(dir+'', indexController.index);

router.get(dir+'map', indexController.map);

router.get(dir+'map:id', indexController.circuit);

router.get(dir+'mine', indexController.mine);

router.get(dir+'editor', indexController.editor);

router.get(dir+'terrain', indexController.terrain_1)

module.exports = router;