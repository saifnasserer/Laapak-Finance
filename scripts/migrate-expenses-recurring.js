require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Migration queries to add columns for recurring expenses
const migrationQueries = [
  'ALTER TABLE expenses ADD COLUMN is_recurring BOOLEAN NOT NULL DEFAULT FALSE;',
  'ALTER TABLE expenses ADD COLUMN recurring_frequency ENUM("daily", "weekly", "monthly", "yearly") NULL DEFAULT NULL;',
  'ALTER TABLE expenses ADD COLUMN recurring_end_date DATE NULL DEFAULT NULL;'
];

async function runMigration() {
  let connection;
  try {
    console.log('Connecting to the database for recurring expenses migration...');
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
    console.log('Database connection successful.');

    for (const query of migrationQueries) {
      try {
        const columnName = query.split('ADD COLUMN ')[1].split(' ')[0];
        console.log(`Running migration: Adding ${columnName} column...`);
        await connection.query(query);
        console.log(`Migration successful: ${columnName} column added.`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          const columnName = error.message.match(/'(.*?)'/)[1];
          console.log(`Migration not needed: ${columnName} column already exists.`);
        } else {
          throw error; // Re-throw other errors
        }
      }
    }

  } catch (error) {
    console.error('Failed to run recurring expenses migration:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

runMigration();
