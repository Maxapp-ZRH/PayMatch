# GitHub Workflows Documentation

This document provides comprehensive documentation for all GitHub Actions workflows in the PayMatch project.

## Overview

The PayMatch project uses four GitHub Actions workflows to automate database management, testing, type checking, and deployment processes. All workflows are focused on Supabase integration and ensure code quality and database consistency.

## Workflow Summary

| Workflow                                      | Trigger              | Purpose                          | Frequency             |
| --------------------------------------------- | -------------------- | -------------------------------- | --------------------- |
| [Database Types Check](#database-types-check) | PR to main, Manual   | Validates type consistency       | On every PR           |
| [Supabase Tests](#supabase-tests)             | PR to main, Manual   | Runs database and function tests | On every PR           |
| [Supabase Backup](#supabase-backup)           | Schedule, Manual     | Creates database backups         | Daily at midnight UTC |
| [Supabase Deploy](#supabase-deploy)           | Push to main, Manual | Deploys to production            | On every main push    |

---

## Database Types Check

**File:** `.github/workflows/supabase-types-check.yml`

### Purpose

Ensures that TypeScript types generated from the database schema are always in sync with the committed types file. This prevents runtime errors caused by type mismatches.

### Triggers

- Pull requests to `main` branch
- Manual workflow dispatch

### Process

1. **Setup**: Checks out code and installs Supabase CLI
2. **Database Start**: Starts local Supabase database
3. **Apply Migrations**: Resets database with latest migrations (no seeds)
4. **Generate Types**: Creates fresh TypeScript types from current schema
5. **Type Drift Check**: Compares generated types with committed `src/types/database.ts`
6. **Cleanup**: Removes temporary generated types file

### Key Features

- **Type Drift Detection**: Identifies when database schema changes aren't reflected in TypeScript types
- **Detailed Error Messages**: Provides clear instructions for fixing type drift
- **Preview Output**: Shows differences between generated and committed types
- **Performance Optimized**: Uses `diff` with optimized flags for fast comparison

### Error Handling

When type drift is detected, the workflow:

- Fails with exit code 1
- Provides step-by-step fix instructions
- Shows preview of both type files
- Displays full diff for debugging

### Required Actions

If the workflow fails:

1. Run `npm run types:db:local`
2. Commit the updated types file
3. Update code to use new types

---

## Supabase Tests

**File:** `.github/workflows/supabase-tests.yml`

### Purpose

Runs comprehensive tests for both database operations and Edge Functions to ensure code quality and functionality.

### Triggers

- Pull requests to `main` branch
- Manual workflow dispatch

### Test Jobs

#### Database Tests (`db-tests`)

- **Runtime**: Ubuntu latest
- **Process**:
  - Starts local Supabase database
  - Runs pgTAP tests from `supabase/tests/` directory
- **Purpose**: Validates database schema, functions, and RLS policies

#### Function Tests (`functions-tests`)

- **Runtime**: Ubuntu latest
- **Dependencies**: Deno runtime
- **Process**:
  - Starts local Supabase database
  - Runs Deno tests with `deno-test.ts`
  - Uses `.env.local` for environment variables
- **Purpose**: Tests Edge Functions functionality

### Test Structure

- **Database Tests**: Located in `supabase/tests/` (pgTAP format)
- **Function Tests**: Located in `deno-test.ts` (Deno test format)
- **Environment**: Uses local Supabase instance for isolated testing

---

## Supabase Backup

**File:** `.github/workflows/supabase-backups.yml`

### Purpose

Creates automated daily backups of the production database to ensure data safety and disaster recovery capabilities.

### Triggers

- **Scheduled**: Daily at midnight UTC (`0 0 * * *`)
- **Manual**: Workflow dispatch

### Backup Process

1. **Authentication**: Links to Supabase project using access token
2. **Roles Backup**: Exports database roles to `supabase/backups/roles.sql`
3. **Schema Backup**: Exports complete schema to `supabase/backups/schema.sql`
4. **Data Backup**: Exports data with COPY format to `supabase/backups/data.sql`
5. **Commit**: Automatically commits backup files to repository

### Backup Files

- **`roles.sql`**: Database roles and permissions
- **`schema.sql`**: Complete database schema (tables, functions, policies)
- **`data.sql`**: All data in COPY format for efficient restoration

### Security

- Uses GitHub Secrets for authentication
- Commits with dedicated backup bot identity
- Files are version-controlled for audit trail

### Required Secrets

- `SUPABASE_ACCESS_TOKEN`: Supabase access token
- `PROJECT_ID`: Supabase project identifier
- `SUPABASE_DB_PASSWORD`: Database password for linking

---

## Supabase Deploy

**File:** `.github/workflows/supabase-deploy.yml`

### Purpose

Automatically deploys database migrations and Edge Functions to production when changes are pushed to the main branch.

### Triggers

- Push to `main` branch
- Manual workflow dispatch

### Concurrency Control

- **Group**: `supabase-deploy-main`
- **Behavior**: Cancels in-progress deployments when new changes are pushed
- **Purpose**: Prevents deployment conflicts and ensures latest changes are deployed

### Deployment Process

1. **Authentication**: Links to Supabase project
2. **Database Migration**: Pushes all pending migrations to production
3. **Edge Functions**: Deploys all functions in `supabase/functions/` directory
4. **Conditional Deployment**: Only deploys functions if directory exists and is not empty

### Migration Strategy

- **Command**: `supabase db push`
- **Scope**: All pending migrations
- **Seeds**: Excluded from production (seeds are for local/staging only)
- **Safety**: Uses production-safe deployment method

### Edge Functions Deployment

- **Conditional**: Only runs if functions directory exists and contains files
- **Command**: `supabase functions deploy`
- **Scope**: All functions in the directory
- **Runtime**: Deno-based serverless functions

### Required Secrets

- `SUPABASE_ACCESS_TOKEN`: Supabase access token
- `PROJECT_ID`: Supabase project identifier
- `SUPABASE_DB_PASSWORD`: Database password for linking

---

## Environment Variables and Secrets

### Required GitHub Secrets

All workflows require these secrets to be configured in the repository settings:

| Secret                  | Used By        | Purpose                               |
| ----------------------- | -------------- | ------------------------------------- |
| `SUPABASE_ACCESS_TOKEN` | Backup, Deploy | Supabase API authentication           |
| `PROJECT_ID`            | Backup, Deploy | Identifies target Supabase project    |
| `SUPABASE_DB_PASSWORD`  | Backup, Deploy | Database password for project linking |

### Local Environment

- **`.env.local`**: Used by function tests for environment variables
- **Local Database**: All workflows use local Supabase instances for testing

---

## Best Practices

### Development Workflow

1. **Make Changes**: Create feature branch with database changes
2. **Test Locally**: Run `supabase db reset` and `npm run types:db:local`
3. **Create PR**: Workflows will automatically validate types and run tests
4. **Merge to Main**: Automatic deployment to production

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
- All backups are version-controlled
- Test restore procedures regularly

---

## Troubleshooting

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
# Test type generation locally
npm run types:db:local

# Test database locally
supabase db reset
supabase test db

# Test functions locally
deno test --allow-all deno-test.ts --env-file .env.local

# Manual backup
supabase db dump -f backup.sql
```

---

## Monitoring and Alerts

### Workflow Status

- Monitor workflow runs in GitHub Actions tab
- Set up notifications for workflow failures
- Review deployment logs for issues

### Backup Monitoring

- Check backup commit history
- Verify backup file sizes and timestamps
- Test restore procedures periodically

### Performance Monitoring

- Monitor deployment times
- Track test execution duration
- Optimize slow-running workflows

---

## Future Enhancements

### Potential Improvements

- **Parallel Testing**: Run database and function tests in parallel
- **Advanced Type Checking**: Add more sophisticated type validation
- **Backup Compression**: Compress backup files for storage efficiency
- **Deployment Rollback**: Add rollback capabilities for failed deployments
- **Performance Testing**: Add load testing for Edge Functions
- **Security Scanning**: Integrate security vulnerability scanning

### Workflow Extensions

- **Staging Environment**: Add staging deployment workflow
- **Feature Branch Testing**: Test against staging for feature branches
- **Integration Tests**: Add end-to-end integration testing
- **Performance Benchmarks**: Track and monitor performance metrics
