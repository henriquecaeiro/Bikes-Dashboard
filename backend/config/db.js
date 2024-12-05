// /backend/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // Carrega variáveis de ambiente

// Cria a conexão com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
