const {Pool} = require('pg');
const {pubSub} = require('./subscriptions');

const pool = new Pool({
    user: 'testDB',
    host: 'localhost',
    database: 'testDB',
    password: '123456',
    port: 5432,
});

const query = (text, params) => pool.query(text, params);
pool.connect((err, client, done) => {
    if (err) throw err;

    client.on('notification', msg => {
        const payload = JSON.parse(msg.payload);
        pool.query('SELECT * FROM users WHERE id = $1', [payload.sender_id], (err, res) => {
            if (err) throw err;
            payload.sender = res.rows[0];
            pubSub.publish('MESSAGE_SENT', {messageSent: payload});
        });
    });

    client.query('LISTEN new_message');
});

module.exports = {query};
