# GitHub Workflows & Development Guide

This document provides a comprehensive overview of our GitHub Actions workflows, branching strategy, and development processes for the PayMatch project.

## 🚀 GitHub Actions Workflows

### Overview

We use GitHub Actions to automate database management, testing, type checking, and deployment processes. All workflows are focused on Supabase integration and ensure code quality and database consistency.

### Workflow Summary

| Workflow                                      | Trigger              | Purpose                          | Frequency             |
| --------------------------------------------- | -------------------- | -------------------------------- | --------------------- |
| [Database Types Check](#database-types-check) | PR to main, Manual   | Validates type consistency       | On every PR           |
| [Supabase Tests](#supabase-tests)             | PR to main, Manual   | Runs database and function tests | On every PR           |
| [Supabase Backup](#supabase-backup)           | Schedule, Manual     | Creates database backups         | Daily at midnight UTC |
| [Supabase Deploy](#supabase-deploy)           | Push to main, Manual | Deploys to production            | On every main push    |

---

## 📋 Workflow Details

### Database Types Check

**File:** `.github/workflows/supabase-types-check.yml`

**Purpose:** Ensures TypeScript types generated from the database schema are always in sync with the committed types file.

**Process:**

1. Starts local Supabase database
2. Applies latest migrations (no seeds)
3. Generates fresh TypeScript types
4. Compares with committed `src/types/database.ts`
5. Fails if type drift is detected

**Key Features:**

- Type drift detection
- Detailed error messages with fix instructions
- Performance optimized comparison

### Supabase Tests

**File:** `.github/workflows/supabase-tests.yml`

**Purpose:** Runs comprehensive tests for database operations and Edge Functions.

**Test Jobs:**

- **Database Tests**: pgTAP tests from `supabase/tests/`
- **Function Tests**: Deno tests with `deno-test.ts`

### Supabase Backup

**File:** `.github/workflows/supabase-backups.yml`

**Purpose:** Creates automated daily backups of the production database.

**Backup Process:**

1. Links to Supabase project
2. Creates comprehensive backup with timestamp
3. Creates latest backup symlink
4. Cleans up old backups (30+ days)
5. Commits backup files to **staging branch**

**Key Features:**

- Daily automated backups at midnight UTC
- Manual trigger available
- Automatic cleanup of old backups
- Commits to staging (not main) to keep main clean

### Supabase Deploy

**File:** `.github/workflows/supabase-deploy.yml`

**Purpose:** Automatically deploys database migrations and Edge Functions to production.

**Deployment Process:**

1. Links to Supabase project
2. Pushes all pending migrations
3. Pushes Supabase configuration
4. Deploys Edge Functions (if directory exists)
5. Uses production-safe deployment methods

---

## 🌳 Branching Strategy

### Branch Structure

```
main (production)
  ↑
staging (integration)
  ↑
feature branches (development)
```

### Branch Purposes

- **`main`**: Production-ready code, stable releases
- **`staging`**: Integration branch, testing ground for features
- **`feature/*`**: Individual feature development
- **`auth`**: Authentication system (integrated into staging)
- **`marketing_pages`**: Marketing and legal pages (integrated into staging)

### Development Workflow

#### 1. Feature Development

```bash
# Create feature branch from staging
git checkout staging
git pull origin staging
git checkout -b feature/your-feature-name

# Develop your feature
# ... make changes ...

# Commit and push
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

#### 2. Integration to Staging

```bash
# Merge feature to staging
git checkout staging
git pull origin staging
git merge feature/your-feature-name
git push origin staging

# Test integration in staging
# ... test all features together ...
```

#### 3. Production Release

```bash
# When ready, merge staging to main
git checkout main
git pull origin main
git merge staging
git push origin main

# This triggers automatic deployment
```

---

## 🔄 Automated Processes

### Daily Backups

- **When**: Every day at midnight UTC
- **What**: Complete database backup with schema and data
- **Where**: Committed to staging branch
- **Cleanup**: Old backups (30+ days) are automatically removed

### Type Safety

- **When**: Every PR to main
- **What**: Validates database types are in sync
- **Action**: Fails PR if types are out of sync
- **Fix**: Run `npm run types:db:local` and commit changes

### Testing

- **When**: Every PR to main
- **What**: Runs database and function tests
- **Coverage**: pgTAP database tests + Deno function tests
- **Action**: Fails PR if tests don't pass

### Deployment

- **When**: Push to main branch
- **What**: Deploys migrations and Edge Functions to production
- **Safety**: Uses production-safe deployment methods
- **Scope**: All pending migrations and functions

---

## 🛠️ Development Commands

### Database Management

```bash
# Generate types from local database
npm run types:db:local

# Generate types from cloud database
npm run types:db:cloud

# Reset local database
supabase db reset

# Push migrations to remote
supabase db push

# Push configuration to remote
supabase config push

# Pull remote changes
supabase db pull
```

### Testing

```bash
# Run database tests
supabase test db

# Run function tests
deno test --allow-all deno-test.ts --env-file .env.local

# Run all tests
npm test
```

### Backup Management

```bash
# Manual backup
./scripts/backup-db.sh

# Check backup status
ls -la supabase/backups/
```

---

## 🔐 Security & Secrets

### Required GitHub Secrets

| Secret                  | Used By        | Purpose                               |
| ----------------------- | -------------- | ------------------------------------- |
| `SUPABASE_ACCESS_TOKEN` | Backup, Deploy | Supabase API authentication           |
| `PROJECT_ID`            | Backup, Deploy | Identifies target Supabase project    |
| `SUPABASE_DB_PASSWORD`  | Backup, Deploy | Database password for project linking |

### Security Best Practices

- Never expose service-role keys to client-side code
- Use RLS policies as primary security layer
- Validate all inputs with Zod schemas
- Use proper authentication in Edge Functions

---

## 📊 Monitoring & Maintenance

### Workflow Monitoring

- Monitor workflow runs in GitHub Actions tab
- Set up notifications for workflow failures
- Review deployment logs for issues

### Backup Monitoring

- Check backup commit history in staging
- Verify backup file sizes and timestamps
- Test restore procedures periodically

### Performance Monitoring

- Monitor deployment times
- Track test execution duration
- Optimize slow-running workflows

---

## 🚨 Troubleshooting

### Common Issues

#### Type Drift Errors

- **Cause**: Database schema changed but types not updated
- **Fix**: Run `npm run types:db:local` and commit changes

#### Test Failures

- **Database Tests**: Check pgTAP test syntax and database state
- **Function Tests**: Verify Deno test configuration and environment variables

#### Deployment Failures

- **Authentication**: Verify Supabase access token and project ID
- **Migrations**: Check migration syntax and dependencies
- **Functions**: Ensure Deno functions are properly configured

#### Backup Issues

- **Permissions**: Verify repository write permissions
- **Authentication**: Check Supabase access token validity
- **Storage**: Ensure sufficient repository space for backup files

### Debug Commands

```bash
# Check migration status
supabase migration list

# Verify function permissions
\df+ public.*

# Check RLS policies
\dp+ public.table_name

# Test with different user roles
-- Use different authenticated users to test access control
```

---

## 🎯 Best Practices

### Development Workflow

1. **Make Changes**: Create feature branch with database changes
2. **Test Locally**: Run `supabase db reset` and `npm run types:db:local`
3. **Create PR**: Workflows will automatically validate types and run tests
4. **Merge to Staging**: Test integration with other features
5. **Merge to Main**: Automatic deployment to production

### Type Safety

- Always run `npm run types:db:local` after schema changes
- Commit updated types with schema changes
- Never ignore type drift warnings

### Testing

- Add pgTAP tests for new database functions
- Test Edge Functions with Deno test suite
- Ensure all tests pass before merging

### Backup Strategy

- Backups run automatically daily
- Manual backups available via workflow dispatch
- All backups are version-controlled in staging
- Test restore procedures regularly

---

## 🔮 Future Enhancements

### Potential Improvements

- **Parallel Testing**: Run database and function tests in parallel
- **Advanced Type Checking**: Add more sophisticated type validation
- **Backup Compression**: Compress backup files for storage efficiency
- **Performance Testing**: Add load testing for Edge Functions
- **Security Scanning**: Integrate security vulnerability scanning

### Workflow Extensions

- **Staging Environment**: Add staging deployment workflow
- **Feature Branch Testing**: Test against staging for feature branches
- **Integration Tests**: Add end-to-end integration testing
- **Performance Benchmarks**: Track and monitor performance metrics

---

## 📚 Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [pgTAP Testing Framework](https://pgtap.org/)
- [Deno Testing Documentation](https://deno.land/manual/testing)

---

_This document is maintained alongside the codebase. Please update it when workflows or processes change._
