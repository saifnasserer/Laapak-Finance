require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS receivables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    project_name VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('Due', 'Paid', 'Overdue') NOT NULL DEFAULT 'Due',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

async function initializeDatabase() {
  let connection;
  try {
    console.log('Connecting to the database to create receivables table...');
    connection = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD });
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    await connection.changeUser({ database: DB_NAME });
    console.log('Database connection successful.');

    console.log('Creating receivables table...');
    await connection.query(createTableQuery);
    console.log('Receivables table created or already exists.');

  } catch (error) {
    console.error('Failed to initialize receivables table:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

initializeDatabase();
