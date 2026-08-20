import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function addWalletCoinsColumn() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'collegemart';

  console.log('💰 Adding Wallet Coins Column to Users Table...\n');
  console.log(`📍 Connection Details:`);
  console.log(`   Host: ${host}`);
  console.log(`   User: ${user}`);
  console.log(`   Database: ${database}\n`);

  try {
    const connection = await mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database,
    });
    
    console.log('🔗 Connected to database\n');

    const [checkColumn] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'coins' AND TABLE_SCHEMA = ?`,
      [database]
    );
    
    if (checkColumn.length > 0) {
      console.log('✅ Coins column already exists in users table\n');
    } else {

      console.log('⚙️  Adding coins column to users table...');
      await connection.query('ALTER TABLE users ADD COLUMN coins INT DEFAULT 0');
      console.log('✅ Coins column added successfully\n');
    }

    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Total users in database: ${users[0].count}\n`);
    
    await connection.end();
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    process.exit(1);
  }
}

addWalletCoinsColumn();
