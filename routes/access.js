var express = require('express');
var router = express.Router();
const modules = require(require('path').resolve(process.cwd(), 'modules.js'));
const App = modules.app;

router.all('/:interface/:fn*', function (req, res, next) {
    const no_login_interface = {
    };

    if (req.session.account_login == undefined
        && (!no_login_interface[req.params.interface]
        || no_login_interface[req.params.interface].indexOf(req.params.fn) < 0)
    ) {
        return res.json(App.error.nologin);
    }

    next();
});

module.exports = router;