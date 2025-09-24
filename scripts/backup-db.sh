#!/bin/bash

# PayMatch Database Backup Script
# Creates a manual backup of the Supabase database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 PayMatch Database Backup Script${NC}"
echo "=================================="

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found. Please install it first.${NC}"
    echo "Visit: https://supabase.com/docs/guides/cli/getting-started"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo -e "${RED}❌ Not in a Supabase project directory.${NC}"
    echo "Please run this script from the project root."
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p supabase/backups

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="supabase/backups/manual_backup_${TIMESTAMP}.sql"

echo -e "${YELLOW}📅 Creating backup: ${BACKUP_FILE}${NC}"

# Check if we're linked to a remote project
if supabase status | grep -q "linked"; then
    echo -e "${BLUE}🔗 Backing up from remote Supabase project...${NC}"
    supabase db dump -f "$BACKUP_FILE"
else
    echo -e "${BLUE}🏠 Backing up from local Supabase instance...${NC}"
    supabase db dump -f "$BACKUP_FILE" --local
fi

# Check if backup was successful
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✅ Backup created successfully!${NC}"
    echo -e "${GREEN}📊 Backup size: ${BACKUP_SIZE}${NC}"
    echo -e "${GREEN}📁 Location: ${BACKUP_FILE}${NC}"
    
    # Create latest symlink
    ln -sf "$(basename "$BACKUP_FILE")" supabase/backups/latest.sql
    echo -e "${GREEN}🔗 Latest backup symlink updated${NC}"
else
    echo -e "${RED}❌ Backup failed!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}💡 Tips:${NC}"
echo "- Use 'supabase db reset' to restore from a backup"
echo "- Backups are automatically created nightly via GitHub Actions"
echo "- Old backups are cleaned up after 30 days"
