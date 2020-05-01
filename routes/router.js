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

router.get(dir+'terrain:id', indexController.terrain);

router.get(dir+'tree', indexController.environnement);
router.get(dir+'bush', indexController.environnement);
router.get(dir+'forest', indexController.environnement);


module.exports = router;