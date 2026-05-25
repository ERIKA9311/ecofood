const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'ecofood'
});

module.exports = pool.promise();