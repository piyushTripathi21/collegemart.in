# Environment Configuration Guide

## 📝 .env File Explanation

The `.env` file in the root directory controls your application configuration:

```
# Database Connection Settings
DB_HOST=localhost              # MySQL server location (usually localhost)
DB_USER=root                   # MySQL username
DB_PASSWORD=                   # MySQL password (leave empty if no password)
DB_NAME=collegemart            # Database name to use

# Server Settings
PORT=5000                      # Backend API server port

# Environment
NODE_ENV=development           # Use 'development' or 'production'
```

## 🔑 Finding Your MySQL Credentials

### Windows
1. Open Command Prompt or PowerShell
2. Run: `mysql -u root` (if no password) or `mysql -u root -p` (if has password)
3. If it connects, your default is:
   - `DB_USER=root`
   - `DB_PASSWORD=` (blank)

### If MySQL has a Password
During MySQL installation, you may have set a root password. To check:

1. Try connecting with password:
   ```bash
   mysql -u root -p
   ```
2. If it asks for password, you have one set
3. Add to .env:
   ```
   DB_PASSWORD=your_actual_password
   ```

## ✅ Example Configurations

### Configuration 1: MySQL with No Password (Default)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=collegemart
PORT=5000
NODE_ENV=development
```

### Configuration 2: MySQL with Password
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mySecurePassword123
DB_NAME=collegemart
PORT=5000
NODE_ENV=development
```

### Configuration 3: Remote MySQL Server
```
DB_HOST=192.168.1.100
DB_USER=collegemart_user
DB_PASSWORD=secure_pass
DB_NAME=collegemart
PORT=5000
NODE_ENV=development
```

## 🧪 Testing Your Configuration

### Test Connection
Run after updating .env:
```bash
npm run setup-db
```

### Check API Health
Once servers are running:
```bash
# In your browser or terminal:
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "Database connected successfully"
}
```

## 🔒 Security Notes

### Local Development (Current Setup)
- ⚠️ `.env` is in `.gitignore` - NOT committed to git
- Safe for local development
- Sample password is just an example

### For Production (Future)
- Never commit `.env` to version control
- Use environment variable services
- Rotate passwords regularly
- Use dedicated database user (not root)
- Restrict database access by IP

## 🆘 Troubleshooting

### "Access denied for user 'root'@'localhost'"
**Problem:** MySQL password is incorrect

**Solution:**
```bash
# Test MySQL connection first
mysql -u root -p
# Enter your actual password

# Then update .env with correct password
DB_PASSWORD=your_correct_password

# Try setup again
npm run setup-db
```

### "Can't connect to MySQL server"
**Problem:** MySQL is not running

**Solution - Windows:**
```powershell
# Check if MySQL is running
Get-Service "MySQL80"

# Start MySQL
net start MySQL80
# Or use: Start-Service MySQL80

# If service name differs
Get-Service | grep -i mysql
net start <exact-service-name>
```

**Solution - Mac:**
```bash
brew services start mysql
# or
brew services restart mysql
```

**Solution - Linux:**
```bash
sudo service mysql start
# or
sudo systemctl start mysql
```

### "Unknown database 'collegemart'"
**Problem:** Database not created yet

**Solution:**
```bash
npm run setup-db
```

## 📋 MySQL Service Names (Windows)

Common MySQL service names:
- `MySQL80` (MySQL 8.0)
- `MySQL57` (MySQL 5.7)
- `MySQL56` (MySQL 5.6)
- `MySQL` (Generic)

To find your service name:
```powershell
Get-Service | Select-String -Pattern mysql
```

## 🔄 Changing Database Settings

If you want to use a different database:

1. Update `.env`:
   ```
   DB_NAME=my_different_db
   ```

2. Update `database.sql` (change first line):
   ```sql
   CREATE DATABASE IF NOT EXISTS my_different_db;
   USE my_different_db;
   ```

3. Run setup again:
   ```bash
   npm run setup-db
   ```

## 📊 Multiple Databases

You can work with multiple databases by creating multiple `.env` files:

- `.env` (default)
- `.env.production`
- `.env.testing`

Select which one to use by modifying the load order in `setup-db.js` or using:
```bash
NODE_ENV=production npm run setup-db
```

## ✨ Best Practices

✅ **DO:**
- Keep `.env` in `.gitignore`
- Use strong passwords in production
- Test connection after changing settings
- Document your configuration changes
- Use environment-specific configs

❌ **DON'T:**
- Commit `.env` to git
- Share passwords in messages/emails
- Use same password for multiple services
- Leave default credentials in production
- Store sensitive data in code

---

Any issues? Run: `npm run setup-db` and check the detailed error message!
