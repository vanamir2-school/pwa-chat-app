var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------------------------------- ZDE PRIDAVAT ENDPOINTY
app.use('/', require('./routes/index.js'));
app.use('/user', require('./routes/user.js'));
app.use('/chat', require('./routes/chat.js'));
app.use('/message', require('./routes/message.js'));
// --------------------------------------------------- ZDE PRIDAVAT ENDPOINTY

// IMPORTANT - enables client routing
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
} else {

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });
}

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;

