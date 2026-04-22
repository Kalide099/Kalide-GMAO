#!/bin/bash
# KGMAO Automated MySQL Backup Script
# Automatically drops this script into /etc/cron.daily/db_backup.sh for nightly rotation

DB_USER="root"
DB_PASS="YOUR_STRONG_PASSWORD" # Consider using .my.cnf instead of hardcoding
DB_NAME="kgmao_db"

BACKUP_DIR="/var/backups/kgmao_mysql"
DATE=$(date +'%Y-%m-%d_%H-%M-%S')

# Ensure backup directory exists tightly secured
mkdir -p $BACKUP_DIR
chmod 700 $BACKUP_DIR

# Run the dump
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/kgmao_backup_$DATE.sql.gz

# Delete backups older than 7 days strictly to save VPS disk space
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -delete

echo "KGMAO PostgreSQL/MySQL Backup completed securely."
