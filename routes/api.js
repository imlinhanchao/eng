var express = require('express');
var router = express.Router();
const modules = require(require('path').resolve(process.cwd(), 'modules.js'));
let loader = require('./loader');

router.all('*', function (req, res, next) {
    if (process.env.NODE_ENV === 'development') {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    }
    next();
});

router.use(require('./access'));
router.use('/eng', loader(modules.eng));
router.use('/account', loader(modules.account));
router.use('/notes', loader(modules.notes));

router.get('/', function (req, res) {
    res.render('index', { title: 'API' });
});

module.exports = router;
