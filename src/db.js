const {Pool} = require('pg');

const pool = new Pool({
    user: 'testDB',
    host: 'database',
    database: 'testDB',
    password: '123456',
    port: 5432,
});

const query = (text, params) => pool.query(text, params);

module.exports = {query};
