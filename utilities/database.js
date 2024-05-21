const mysql = require('mysql');
const config = require('../config');

const connection = mysql.createConnection({
    host: config.database.db_host,
    user: config.database.db_user,
    database: config.database.db_name,
    password: config.database.db_password,
    multipleStatements: true
});

connection.connect(err => {
    if (err) throw err;
    console.log('Database Connected!')
});

module.exports = connection;