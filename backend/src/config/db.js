import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config({ quiet: true });


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE
});

pool.getConnection()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err.message));
  
export default pool;
