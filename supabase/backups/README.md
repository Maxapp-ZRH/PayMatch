# Supabase Backups

This directory contains automated backups of the Supabase database.

- Backups are created nightly at midnight UTC
- Each backup includes the complete database schema and data
- Old backups are automatically cleaned up after 30 days
- The latest backup is symlinked as `latest.sql`

## Manual Backup

To create a manual backup:

```bash
supabase db dump -f supabase/backups/manual_backup_$(date +%Y%m%d_%H%M%S).sql
```
