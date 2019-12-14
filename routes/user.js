const router = require('express').Router();
const connection = require('./../database/db');
const utils = require('./index');

router.post('/signup', function (request, response) {
    const email = request.body.email,
        name = request.body.name,
        password = request.body.password,
        passwordConfirm = request.body.passwordConfirm;

    if (passwordConfirm !== password) {
        response.status(403).send('Passwords do not match.');
        return;
    }
    if (email && password && name) {
        // check if there is not the same e-mail already
        connection.query('SELECT email FROM users WHERE email = $1 ', [email]).then(results => {
            if (results.rows.length > 0) {
                response.status(403).send('User with this email already exists.');
                return;
            }
            // insert user
            connection.query('INSERT INTO users VALUES ($1,$2,$3)', [email, name, password]).then(results => {
                response.send('User sign up was succesfull.');
            }).catch(error => {
                utils.isQueryErrorWithLog(error);
            });
        }).catch(error => {
            utils.isQueryErrorWithLog(error);
        });
    }
});

router.post('/login', function (request, response) {
    console.log("Login");

    const email = request.body.email,
        password = request.body.password;
    if (email && password) {
        connection.query('SELECT name FROM users WHERE email = $1 AND password = $2', [email, password]).then(results => {
            console.log(JSON.stringify(results));
            if (results.rows.length > 0) {
                request.session.loggedin = true;
                request.session.username = email;
                request.session.name = results.rows[0].name;
                response.end();
            } else
                response.status(403).send('Incorrect username and/or password!');
        }).catch(error => {
            utils.isQueryErrorWithLog(error);
        });
    }
});

// sends back user name and HTTP 200 to logged users, else 401
router.get('/status', function (request, response) {
    if (request.session.loggedin)
        response.send({name: request.session.name, email: request.session.username});
    else
        response.status(401).send('There is no active session. Please log in.');
});

router.get('/logout', function (request, response) {
    if (request.session.loggedin) {
        request.session.loggedin = false;
        response.end();
    } else
        response.status(403).send('You are already logged out.');
});

module.exports = router;