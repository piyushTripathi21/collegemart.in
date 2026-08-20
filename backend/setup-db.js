import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'collegemart';

  console.log('🚀 CollegeMart Database Setup Started\n');
  console.log(`📍 Connection Details:`);
  console.log(`   Host: ${host}`);
  console.log(`   User: ${user}`);
  console.log(`   Database: ${database}\n`);

  try {

    console.log('🔗 Connecting to MySQL Server...');
    const connection = await mysql.createConnection({
      host: host,
      user: user,
      password: password,
      multipleStatements: true,
    });
    console.log('✅ Connected to MySQL Server\n');

    console.log('📄 Reading database.sql file...');
    const sqlFile = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log('✅ SQL file loaded\n');

    console.log('⚙️  Creating database and tables...');
    await connection.query(sql);
    console.log('✅ Database and tables created successfully\n');

    console.log('🔍 Verifying setup...');
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
    const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories');

    console.log('📊 Database Statistics:');
    console.log(`   Users: ${users[0].count}`);
    console.log(`   Products: ${products[0].count}`);
    console.log(`   Categories: ${categories[0].count}\n`);

    await connection.end();

    console.log('✨ Database setup completed successfully!\n');
    console.log('🎉 Next Steps:');
    console.log('   1. Terminal 1: npm run dev');
    console.log('   2. Terminal 2: npm run server');
    console.log('   3. Open: http://localhost:3000\n');

  } catch (error) {
    console.error('❌ Error during database setup:');
    console.error(error.message);
    console.error('\n💡 Troubleshooting Tips:');
    
    if (error.message.includes('Access denied')) {
      console.error('   • Your MySQL has a password');
      console.error('   • Update .env file with DB_PASSWORD');
      console.error('   • Example: DB_PASSWORD=your_password\n');
    }
    
    if (error.message.includes('connect ECONNREFUSED')) {
      console.error('   • MySQL service is not running');
      console.error('   • Start MySQL: net start MySQL80 (Windows)');
      console.error('   • Or check your DB_HOST in .env\n');
    }

    process.exit(1);
  }
}

setupDatabase();
