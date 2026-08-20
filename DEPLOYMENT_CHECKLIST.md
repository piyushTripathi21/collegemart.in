# CollegeMart - Production Deployment Checklist

## Pre-Deployment (1-2 Weeks Before)

### Code Review
- [ ] Review all changes from Week 1-3 implementations
- [ ] Run security audit: `npm audit`
- [ ] Check for console.log statements (should be minimal in production)
- [ ] Verify no API keys/secrets in code
- [ ] Test error handling edge cases

### Database
- [ ] Backup production database
- [ ] Run all migrations: `db-indexes.sql`
- [ ] Verify indexes are created: `SHOW INDEX FROM products;`
- [ ] Test database connectivity from production server
- [ ] Verify MySQL version 5.7+ (for transaction support)

### Testing
- [ ] Run full test suite: `npm test -- --coverage`
- [ ] Achieve 70%+ code coverage
- [ ] Load test with 1000+ concurrent users
- [ ] Test all API endpoints manually
- [ ] Test Socket.io functionality
- [ ] Test file uploads (images)

### Security
- [ ] Set strong `JWT_SECRET` in environment
- [ ] Validate `CORS_ORIGIN` is production domain only
- [ ] Enable HTTPS/SSL certificates
- [ ] Update security headers in helmet config
- [ ] Add rate limiting per user (not just global)
- [ ] Verify CSRF protection if applicable
- [ ] Check for SQL injection vulnerabilities
- [ ] Review password hashing (bcrypt with 10 salt rounds)

### Performance
- [ ] Profile database queries
- [ ] Check query execution times
- [ ] Verify caching headers are set
- [ ] Test with slow network (throttle to 3G)
- [ ] Measure time to first byte (TTFB)
- [ ] Check bundle size is < 300KB

### Environment
- [ ] Create production `.env` file
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper logging (not console.log)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure uptime monitoring
- [ ] Set up automated backups

---

## Deployment Day

### Pre-Deployment
- [ ] Notify users of maintenance window
- [ ] Final backup of database
- [ ] Have rollback plan ready
- [ ] Ensure team is available during deployment

### Deployment Steps

#### 1. Build and Test
```bash
npm install --production
npm run build  # if applicable
npm test  # Run full test suite
```

#### 2. Database Migration
```bash
# SSH into production server
mysql -u production_user -p collegemart < db-indexes.sql

# Verify indexes
mysql -u production_user -p collegemart
SHOW INDEX FROM products;
```

#### 3. Environment Configuration
```bash
# Set production environment variables
export NODE_ENV=production
export JWT_SECRET='strong-random-secret-here'
export CORS_ORIGIN='https://yourdomain.com'
export DB_HOST='your-db-host'
export DB_USER='your-db-user'
export DB_PASSWORD='your-db-password'
export DB_NAME='collegemart'
export PORT=5000
```

#### 4. Start Application
```bash
# Using PM2 for process management
npm install -g pm2
pm2 start server.js --name collegemart
pm2 save
pm2 startup

# Or using Docker
docker build -t collegemart .
docker run -d -p 5000:5000 --env-file .env collegemart
```

#### 5. Verify Deployment
```bash
# Check API health
curl https://yourdomain.com/api/health

# Check logs
pm2 logs collegemart

# Test key endpoints
curl https://yourdomain.com/api/products?page=1&limit=5
```

### Post-Deployment
- [ ] Monitor error logs for 1 hour
- [ ] Check performance metrics
- [ ] Verify database connections
- [ ] Test user registration/login
- [ ] Test product upload
- [ ] Test chat functionality
- [ ] Monitor server resources (CPU, RAM, disk)
- [ ] Notify users deployment is complete

---

## Production Checklist

### Application
- [ ] Remove all `console.log()` statements (use logger instead)
- [ ] Add request logging middleware
- [ ] Implement error tracking (Sentry, Rollbar)
- [ ] Add performance monitoring (New Relic, DataDog)
- [ ] Configure proper error messages (no stack traces to client)
- [ ] Implement request ID tracking for debugging

### Database
- [ ] Enable slow query logging
- [ ] Set up automated backups (hourly)
- [ ] Configure point-in-time recovery
- [ ] Monitor query performance
- [ ] Set up alerts for disk space

### Security
- [ ] Enable HTTPS/TLS 1.2+
- [ ] Implement HSTS headers
- [ ] Enable security headers (CSP, X-Frame-Options)
- [ ] Set up WAF (Web Application Firewall)
- [ ] Monitor for DDoS attacks
- [ ] Regular security patches
- [ ] Implement rate limiting per IP
- [ ] Monitor failed login attempts

### Monitoring & Alerting
- [ ] Set up uptime monitoring
- [ ] Configure alerts for:
  - [ ] API response time > 5s
  - [ ] Error rate > 1%
  - [ ] CPU usage > 80%
  - [ ] Memory usage > 85%
  - [ ] Disk usage > 90%
  - [ ] Database connection pool exhausted

### Scalability
- [ ] Set up load balancer (Nginx, HAProxy)
- [ ] Configure auto-scaling (if cloud-based)
- [ ] Implement caching (Redis)
- [ ] Set up CDN for static assets
- [ ] Monitor peak load capacity

---

## Monitoring Script

Create `monitoring.sh`:

```bash
#!/bin/bash

# Check application health
check_health() {
  response=$(curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/api/health)
  if [ $response -eq 200 ]; then
    echo "✓ Application health: OK"
  else
    echo "✗ Application health: FAILED (HTTP $response)"
    # Send alert
  fi
}

# Check database
check_database() {
  mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD -e "SELECT 1;" > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "✓ Database: OK"
  else
    echo "✗ Database: FAILED"
    # Send alert
  fi
}

# Check disk space
check_disk() {
  usage=$(df / | tail -1 | awk '{print int($5)}')
  if [ $usage -lt 90 ]; then
    echo "✓ Disk usage: ${usage}%"
  else
    echo "✗ Disk usage: CRITICAL (${usage}%)"
    # Send alert
  fi
}

# Run checks
check_health
check_database
check_disk
```

Run every 5 minutes via cron:
```bash
*/5 * * * * /path/to/monitoring.sh >> /var/log/collegemart-monitoring.log 2>&1
```

---

## Rollback Plan

If deployment fails:

```bash
# Revert to previous version
pm2 delete collegemart
git checkout previous-stable-commit
npm install
pm2 start server.js --name collegemart

# Or restore from backup
mysql collegemart < /backup/collegemart-backup.sql
```

---

## Post-Launch Monitoring (First Week)

- [ ] Monitor error rates (target: < 0.5%)
- [ ] Monitor API response times (target: < 500ms)
- [ ] Monitor database connection pool
- [ ] Check user registration rate
- [ ] Monitor product upload success rate
- [ ] Check Socket.io connection stability
- [ ] Review user feedback
- [ ] Monitor for security incidents

---

## Performance Targets

| Metric | Target | Action if Failed |
|--------|--------|------------------|
| API Response Time | < 500ms | Optimize queries, add caching |
| Page Load Time | < 2s | Optimize assets, enable compression |
| Error Rate | < 0.5% | Review logs, fix bugs |
| Uptime | 99.9% | Investigate downtime, improve infra |
| Database Query Time | < 100ms | Add indexes, optimize queries |
| Concurrent Users | 1000+ | Scale horizontally, add load balancer |

---

## Maintenance Windows

Schedule regular maintenance:
- **Weekly**: Security patches, dependency updates
- **Monthly**: Database optimization, index analysis
- **Quarterly**: Full security audit, performance review

Always notify users 24 hours before maintenance with expected downtime (typically 30-60 minutes).

---

## Success Criteria

Project is ready to launch when:
- ✅ All code changes deployed and tested
- ✅ Database indexes applied
- ✅ 70%+ test coverage achieved
- ✅ Zero critical security issues
- ✅ Performance benchmarks met
- ✅ Monitoring and alerting configured
- ✅ Backup and rollback procedures in place
- ✅ Team trained on monitoring and troubleshooting
