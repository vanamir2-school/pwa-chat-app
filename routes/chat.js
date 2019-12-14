const router = require('express').Router();
const connection = require('./../database/db');
const utils = require('./index');

router.get('/getAll', function (request, response) {
    // console.log('chat/getAll call... starting: ' + request.session.username);
    const
        sql = 'SELECT chat.name as name, chat.id_chat as id, to_char(chat.lastmsg_timestamp, \'Mon dd  HH24:MM\') as timestamp, chat.lastmsg as lastmsg ' +
            'FROM ismember uc ' +
            'JOIN chat ON uc.chat_id = chat.id_chat ' +
            'WHERE uc.user_email = $1 ' +
            'ORDER BY chat.lastmsg_timestamp DESC ';
    connection.query(sql, [request.session.username]).then(results => {
        response.json(results.rows);
    }).catch(error => {
        utils.isQueryErrorWithLog(error);
        response.status(500).send('Error while performing Query.');
    });
});

router.post('/add', function (request, response) {
    const emails = request.body.emails.concat(',').concat(request.session.username).trim();
    const emailsArr = emails.split(',');
    console.log(emailsArr);
    const chatName = request.body.chatName;
    let chatId = null;
    //console.log(chatName);

    // check whether there is not already chat with same name
    connection.query('SELECT * FROM chat WHERE name = $1 ', [chatName]).then(results => {
        if (results.rows.length > 0)
            response.status(403).send('Chat with this name already exists.');
        else {
            connection.query('INSERT INTO chat (name, lastmsg_timestamp, lastmsg) VALUES ($1, NOW(), \'Welcome to aChat\') RETURNING id_chat ', [chatName]).then(results => {
                console.log('New chat added: ' + chatName);
                console.log(results.rows[0].id_chat);
                chatId = results.rows[0].id_chat;
                let string = '';
                let bar = new Promise((resolve) => {
                    emailsArr.forEach(function (email, index) {
                        // queries are nested in each other to prevent asynchronous run
                        connection.query('INSERT INTO ismember VALUES ($1,$2) ', [chatId, email]).then(results => {
                            // inform client to update chat and messages
                            utils.update(chatId);
                            string = string.concat('User ', email.toString(), ' was added ☺ \n');

                            if (index === emailsArr.length - 1)
                                resolve();
                        }).catch(error => {
                            /*// DELETE IS MEMBER
                            connection.query('DELETE FROM ismember WHERE chat_id = $1 AND user_email = ', [chatId,email]).then(results => {
                                console.log('DELETED ismember');
                            }).catch(error => {
                                utils.isQueryErrorWithLog(error);
                            });
                            // DELETE CHAT
                            connection.query('DELETE FROM chat WHERE id_chat = $1 ', [chatId]).then(results => {
                                console.log('DELETED chat');
                                // inform client to update chat and messages
                                utils.update(chatId);
                            }).catch(error => {
                                utils.isQueryErrorWithLog(error);
                            });
                            */

                            string = string.concat('User ', email.toString(), ' was NOT added. User does not exist or you are trying to add him multiple times.\n');
                            console.log(string);
                            response.status(403).send(string);
                            utils.isQueryErrorWithLog(error);
                        });
                    });
                });
                bar.then(() => {
                    console.log(string);
                    response.send(string);
                });
            }).catch(error => {
                console.log('DELETED 2');
                utils.isQueryErrorWithLog(error);
            });
        }
    }).catch(error => {
        utils.isQueryErrorWithLog(error);
    });
});

module.exports = router;