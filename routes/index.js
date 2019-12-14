const router = require('express').Router();
const webSocket = require('./../bin/www');
const connection = require('./../database/db');

/* GET home page of backend server. */
router.get('/express', function (req, res) {
    res.render('index', {title: 'Express'});
});

module.exports = router;

// This function finds all users in chat given by chatId. Afterwards, it inform active clients to update chat and messages through webSocket.
module.exports.update = function informClientsToUpdate(chatId) {
    connection.query('SELECT user_email FROM ismember WHERE chat_id = $1', [chatId]).then(results => {
        console.log(' --- emails to update:' + JSON.stringify(results.rows));

        //webSocket.sendMsg('update', [{user_email:'a@a'},{user_email:'b@b'}]);
        webSocket.sendMsg('update', results.rows);
    }).catch(error => {
        console.log('Error while performing Query: '.concat(error));
        response.status(403).send('Given value of chatId can not be accepted.');
    });
};

module.exports.isQueryErrorWithLog = function isQueryErrorWithLog(error) {
    if (error) {
        console.log('Error while performing Query: '.concat(error));
        return true;
    }
    return false;
};


