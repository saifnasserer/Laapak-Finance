require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const addDescriptionQuery = 'ALTER TABLE expenses ADD COLUMN description VARCHAR(255) NOT NULL;';
const modifyCategoryQuery = "ALTER TABLE expenses MODIFY COLUMN category ENUM('مصاريف المكتب', 'مصاريف شخصية') NOT NULL;";

async function runMigration() {
  let connection;
  try {
    console.log('Connecting to the database for V2 migration...');
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
    console.log('Database connection successful.');

    try {
      console.log('Running migration: Adding description column...');
      await connection.query(addDescriptionQuery);
      console.log('Migration successful: description column added.');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('Migration not needed: description column already exists.');
      } else {
        throw error; // Re-throw other errors
      }
    }

    console.log('Running migration: Modifying category column to ENUM...');
    await connection.query(modifyCategoryQuery);
    console.log('Migration successful: category column modified.');

  } catch (error) {
    console.error('Failed to run V2 migration:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

runMigration();
