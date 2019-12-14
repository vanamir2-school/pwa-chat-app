const pg = require('pg');

// heroku config:get DATABASE_URL -a chat-pwa-app -- to manually check connection string from CLI
// heroku database connection string is obtained from 'process.env.DATABASE_URL'
// process.env.DATABASE_URL
const connection = new pg.Client(process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/pwa');
connection.connect();

module.exports = connection;