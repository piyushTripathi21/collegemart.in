# CollegeMart Production Deployment & Operational Plan

This document outlines the procedures for database backups, fail-safe rollbacks, SSL configuration, and production monitoring.

---

## 1. Automated Hourly Database Backups

To prevent data loss, we implement automated hourly backups of the MySQL database. 

### Backup Shell Script (`scripts/backup.sh`)
Create this script on the production host to run hourly backups.

```bash
#!/bin/bash
# Configuration
DB_USER="root"
DB_NAME="collegemart"
BACKUP_DIR="/var/backups/collegemart"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/collegemart_${TIMESTAMP}.sql.gz"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Run mysqldump and compress the output
mysqldump -u "${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" | gzip > "${BACKUP_FILE}"

# Keep only the last 7 days of backups (168 hourly files)
find "${BACKUP_DIR}" -type f -name "collegemart_*.sql.gz" -mtime +7 -delete

echo "[$(date)] Hourly backup completed successfully: ${BACKUP_FILE}"
```

### Automation via Cron
Run `crontab -e` on the host and append the following line to schedule it at the top of every hour:
```cron
0 * * * * /bin/bash /app/scripts/backup.sh >> /var/log/collegemart_backup.log 2>&1
```

---

## 2. Fail-Safe Step-by-Step Rollback Procedures

If a deployment fails or causes critical errors, use this sequence to revert immediately to the previous stable state.

### Step 1: Identify the Previous Stable Version
Locate the previous stable Docker image tag or git commit hash:
```bash
# Get the list of recent deployments or tags
git tag -n
```

### Step 2: Roll Back Frontend/Backend Containers
If using Docker Compose:
1. Update `docker-compose.yml` to point back to the previous stable tag (e.g. `image: collegemart:v1.1.0` instead of `v1.2.0`).
2. Pull and restart the containers:
   ```bash
   docker-compose up -d --force-recreate
   ```

If using Kubernetes:
```bash
kubectl rollout undo deployment/collegemart-deployment
```

### Step 3: Revert Database Schema Migration (If applicable)
If the new release altered the database schema and it is backward-incompatible:
1. Restore the last hourly database backup:
   ```bash
   gunzip -c /var/backups/collegemart/collegemart_latest.sql.gz | mysql -u root -p collegemart
   ```
2. Verify table structures and indexes are restored correctly.

### Step 4: Verify System Health
Run the health check endpoint to verify restoration:
```bash
curl -f http://localhost:5000/api/health
```

---

## 3. HTTPS / SSL Certificate Configuration (Let's Encrypt & Certbot)

For security, all traffic must be encrypted over HTTPS. We use Nginx as a reverse proxy with Let's Encrypt for automatic certificate renewals.

### Step 1: Install Nginx and Certbot
On Ubuntu Server:
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Step 2: Configure Nginx Server Block
Create a configuration file at `/etc/nginx/sites-available/collegemart.in`:
```nginx
server {
    listen 80;
    server_name collegemart.in www.collegemart.in;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/collegemart.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3: Obtain SSL Certificate
Run Certbot to fetch and configure the SSL certificate:
```bash
sudo certbot --nginx -d collegemart.in -d www.collegemart.in
```
Follow the interactive prompts to enable automatic redirection of HTTP to HTTPS.

---

## 4. Production Error Tracking & System Metric Logging

### Error Tracking (Sentry)
- Sentry tracking is fully integrated into the backend.
- To configure, add the Sentry DSN to your environment variables:
  ```env
  SENTRY_DSN=https://your-dsn-key@o12345.ingest.sentry.io/12345
  ```
- Uncaught exceptions, promise rejections, and server-side errors will automatically be logged to Sentry.

### Metric Logging & Alerts (Pino & Winston)
- Server events are logged via structured JSON using the Pino library.
- Log outputs are piped to standard files for metric analytics:
  ```bash
  node server.js >> /var/log/collegemart/server.log 2>&1
  ```
- Configure alerts for status code `5xx` rates exceeding 1% using tools like Datadog, Prometheus, or Grafana.
