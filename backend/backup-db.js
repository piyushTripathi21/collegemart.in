#!/usr/bin/env node

import { execSync, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_HOST     = process.env.DB_HOST     || 'localhost';
const DB_USER     = process.env.DB_USER     || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME     = process.env.DB_NAME     || 'collegemart';
const DB_PORT     = process.env.DB_PORT     || '3306';
const BACKUP_DIR  = process.env.BACKUP_DIR  || path.join(__dirname, 'backups');
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10);

if (!DB_NAME || !DB_USER) {
  console.error('[BACKUP] ❌ DB_NAME and DB_USER must be set in .env');
  process.exit(1);
}

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`[BACKUP] Created backup directory: ${BACKUP_DIR}`);
}

const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').split('Z')[0];
const filename  = `${DB_NAME}_${timestamp}.sql`;
const gzFile    = path.join(BACKUP_DIR, `${filename}.gz`);

const passwordArg = DB_PASSWORD ? `-p${DB_PASSWORD}` : '';
const dumpCmd = [
  `mysqldump`,
  `-h ${DB_HOST}`,
  `-P ${DB_PORT}`,
  `-u ${DB_USER}`,
  passwordArg,
  `--single-transaction`,   // Consistent snapshot for InnoDB without locking
  `--routines`,             // Include stored procedures
  `--triggers`,             // Include triggers
  `--set-gtid-purged=OFF`,  // Avoid GTID issues on replica servers
  DB_NAME,
  `| gzip > "${gzFile}"`
].filter(Boolean).join(' ');

console.log(`[BACKUP] Starting backup of database '${DB_NAME}'...`);
console.log(`[BACKUP] Output: ${gzFile}`);

try {
  execSync(dumpCmd, { stdio: 'pipe', shell: true });

  const stats = fs.statSync(gzFile);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`[BACKUP] ✅ Backup complete — ${filename}.gz (${sizeKb} KB)`);
} catch (err) {
  console.error('[BACKUP] ❌ mysqldump failed:', err.message);

  if (fs.existsSync(gzFile)) fs.unlinkSync(gzFile);
  process.exit(1);
}

console.log(`[BACKUP] Cleaning up backups older than ${RETENTION_DAYS} days...`);
const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
let deleted = 0;

try {
  const files = fs.readdirSync(BACKUP_DIR);
  for (const file of files) {
    if (!file.startsWith(DB_NAME) || !file.endsWith('.sql.gz')) continue;
    const filePath = path.join(BACKUP_DIR, file);
    const mtime = fs.statSync(filePath).mtimeMs;
    if (mtime < cutoff) {
      fs.unlinkSync(filePath);
      deleted++;
      console.log(`[BACKUP] Deleted old backup: ${file}`);
    }
  }
  if (deleted === 0) {
    console.log('[BACKUP] No old backups to remove.');
  } else {
    console.log(`[BACKUP] Removed ${deleted} old backup(s).`);
  }
} catch (err) {
  console.warn('[BACKUP] ⚠️  Retention cleanup failed:', err.message);
}

console.log('[BACKUP] Done.');
