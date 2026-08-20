# CollegeMart Database Setup Guide

## Manual Setup Steps

### Option 1: Using MySQL Command Line

1. **Open MySQL Command Line:**
   ```
   mysql -u root -p
   ```
   (Enter your MySQL root password when prompted)

2. **Copy the entire content of `database.sql` file**

3. **Paste it into the MySQL prompt and press Enter**

4. **Verify the database was created:**
   ```sql
   SHOW DATABASES;
   USE collegemart;
   SHOW TABLES;
   ```

### Option 2: Using MySQL Workbench (GUI)

1. Open MySQL Workbench
2. Click on "File" → "Open SQL Script"
3. Navigate to `database.sql` file
4. Click "Execute" or press Ctrl+Shift+Enter
5. The database will be created automatically

### Option 3: Using MySQL Command Directly

Windows PowerShell:
```powershell
$content = Get-Content "database.sql" -Raw
$content | mysql -u root -p
```

Or provide password in command:
```powershell
$content = Get-Content "database.sql" -Raw
$content | mysql -u root -p"your_password"
```

### Option 4: Using File Import

```bash
mysql -u root -p"your_password" < database.sql
```

## Database Contents

Once setup, you'll have:
- ✅ Users table with 8 sample student users
- ✅ Products table with 8 sample listings
- ✅ Categories table with 12 product categories
- ✅ Wishlist, Reviews, Messages, and Transactions tables
- ✅ All necessary indexes for performance

## Verify Setup

After importing, verify in MySQL:
```sql
USE collegemart;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_categories FROM categories;
```

Expected results:
- Users: 8
- Products: 8
- Categories: 12

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Your MySQL has a password set
- Use: `mysql -u root -p` and enter password
- Or update `.env` file with your password

### "Cannot find MySQL"
- MySQL service might not be running
- Start MySQL service:
  - Windows: `net start MySQL80` (or your version)
  - Mac: `brew services start mysql`
  - Linux: `sudo service mysql start`

### "Database already exists"
- Drop the existing database first:
  ```sql
  DROP DATABASE IF EXISTS collegemart;
  ```
- Then import the SQL file again

## Next Steps

After database setup:
1. Update `.env` with correct credentials if needed
2. Run `npm run dev` to start frontend
3. Run `npm run server` in another terminal to start backend
4. Open `http://localhost:3000` in your browser
