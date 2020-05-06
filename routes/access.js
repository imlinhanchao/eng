var express = require('express');
var router = express.Router();
const modules = require(require('path').resolve(process.cwd(), 'modules.js'));
const App = modules.app;
const Account = modules.account;

router.all('/:interface/:fn*', function (req, res, next) {
    const no_login_interface = {
        eng: '*',
        notes: ['query'],
        account: ['login', 'query'],
        dict: '*'
    };

    let account = new Account(req.session);

    if (!account.islogin
        && (!no_login_interface[req.params.interface]
        || (no_login_interface[req.params.interface] != '*'
        && no_login_interface[req.params.interface].indexOf(req.params.fn) < 0))
    ) {
        return res.json(App.error.nologin);
    }

    next();
});

module.exports = router;