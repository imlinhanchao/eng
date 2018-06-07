var express = require('express');
var router = express.Router();
const modules = require(require('path').resolve(process.cwd(), 'modules.js'));
let loader = require('./loader');

//router.use(require('./access'));
router.use('/eng', loader(modules.eng));
router.use('/account', loader(modules.account));
router.use('/notes', loader(modules.notes));

router.get('/', function (req, res) {
    res.render('index', { title: 'API' });
});

module.exports = router;
