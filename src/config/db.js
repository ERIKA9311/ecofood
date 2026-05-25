const mysql = require('mysql2'); // o 'mysql' según uses

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // 🔽 ¡ESTA ES LA CONFIGURACIÓN CLAVE QUE FALTA! 🔽
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool; // o export default