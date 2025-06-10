require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const expensesTableQuery = `
CREATE TABLE IF NOT EXISTS \`expenses\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`description\` varchar(255) NOT NULL,
  \`amount\` decimal(10,2) NOT NULL,
  \`category\` varchar(100) DEFAULT NULL,
  \`expense_date\` date NOT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

async function initializeDatabase() {
  let connection;
  try {
    console.log('Connecting to the database...');
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
    console.log('Database connection successful.');

    console.log('Creating expenses table if it does not exist...');
    await connection.query(expensesTableQuery);
    console.log('Expenses table created or already exists.');

    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Failed to initialize the database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

initializeDatabase();
