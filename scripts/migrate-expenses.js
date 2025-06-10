require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const migrationQuery = 'ALTER TABLE expenses ADD COLUMN expense_date DATE NOT NULL;';

async function runMigration() {
  let connection;
  try {
    console.log('Connecting to the database for migration...');
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
    console.log('Database connection successful.');

    console.log('Running migration: Adding expense_date column to expenses table...');
    await connection.query(migrationQuery);
    console.log('Migration successful: expense_date column added.');

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Migration not needed: expense_date column already exists.');
    } else {
      console.error('Failed to run migration:', error);
      process.exit(1);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

runMigration();
