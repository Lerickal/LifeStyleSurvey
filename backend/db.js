const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Lerickal',
    database: 'dbSurvey',
});

module.exports = pool;