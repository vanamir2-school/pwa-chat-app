const router = require('express').Router();
const connection = require('./../database/db');
const webSocket = require('./../bin/www');
const utils = require('./index');

// add message
router.post('/add', function (request, response) {
    if(request.body.message === ''){
        response.status(403).send('You can not send empty messsages.');
        return;
    }
    connection.query('INSERT INTO message (text,timestamp,user_email,chat_id) VALUES ($1,NOW(),$2,$3)',
        [request.body.message, request.body.sender, request.body.chatId]).then(results => {
        // refresh chat table
        connection.query('UPDATE chat SET lastmsg_timestamp = NOW(), lastmsg = $1 WHERE id_chat = $2',
            [request.body.message, request.body.chatId]).then(results => {
            console.log('Message added');
            response.end();
        }).catch(error => {
            utils.isQueryErrorWithLog(error);
            response.status(500).send('Chat update was not succesfull.' + error);
        });

        // inform client to update chat and messages
        utils.update(request.body.chatId);

    }).catch(error => {
        utils.isQueryErrorWithLog(error);
        response.status(500).send('Message adding to DB was not succesfull.' + error);
    })
});

router.post('/getLastFifty', function (request, response) {
    console.log('message/getLastTen call... starting: ' + request.session.username);
    console.log(request.session.username);
    console.log(request.body);
    // validation if user performing this operation is member of requested chat
    connection.query('SELECT * FROM ismember uc WHERE uc.user_email = $1 AND uc.chat_id = $2',//
        [request.session.username, request.body.chatId]).then(results => {
        if (results.rows.length <= 0) {
            response.send(401, 'User wants to load messages of chat he does not belong.');
            return;
        }

        // load last 50 messages
        const sql = 'SELECT m.id_msg as id, m.text, to_char(m.timestamp, \'Mon dd  HH24:MM:SS\') as time, m.user_email as sender\n' +
            'FROM message m \n' +
            'WHERE m.chat_id = $1 \n' +
            'ORDER BY m.timestamp ASC\n' +
            'LIMIT 50';
        connection.query(sql, [request.body.chatId]).then(results => {
            console.log(results.rows);
            response.json(results.rows);
        }).catch(error => {
            utils.isQueryErrorWithLog(error);
            response.status(500).send('Error while performing Query.');
        });
    }).catch(error => {
        utils.isQueryErrorWithLog(error);
        response.status(500).send('Error while performing Query.');
    });
});


module.exports = router;