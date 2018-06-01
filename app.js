var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var session = require('express-session');
var robots = require('express-robots');
var FileStore = require('session-file-store')(session);
var partials = require('express-partials');

var api = require('./routes/api');
var config = require(process.cwd() + '/config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals['CONFIG'] = config.web;

// uncomment after placing your favicon in /public
app.use(robots({ UserAgent: '*', Disallow: '/' }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(partials());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    name: config.base.identityKey,
    secret: config.base.secret,
    store: new FileStore(),
    saveUninitialized: false,
    resave: false,
    cookie: {
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : config.base.cookie_domain,
        maxAge: 60 * 60 * 24 * 1000 * 365  // 有效期，单位是毫秒
    }
}));

app.use('/api', api);

// 其他页面交给vue处理
app.use(function (req, res/*, next*/) {
    res.sendfile('public/index.html');
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
