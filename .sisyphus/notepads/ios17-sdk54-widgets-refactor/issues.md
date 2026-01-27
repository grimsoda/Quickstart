# Issues

## 2026-01-27: Accidental workflow modification reverted

**Issue**: Unintended changes were made to `.github/workflows/ios-dev-ipa.yml` - added a patch step for expo-router toolbar style that should not have been committed.

**Resolution**: Reverted the file to match HEAD using `git checkout -- .github/workflows/ios-dev-ipa.yml`

**Impact**: None - changes were never committed, only in working directory.

**Prevention**: Note to verify workflow changes before committing.

## 2026-01-27: bun test fails on Playwright spec

**Issue**: `bun test` at repo root tries to execute Playwright spec and fails with "Playwright Test did not expect test() to be called here".

**Context**: Web tests should run via `bun run --filter web test` (Playwright). The root `bun test` is not configured for Playwright specs.

## 2026-01-27: apps/mobile has no bun test files yet

**Issue**: `bun test` in apps/mobile fails with "0 test files matching" because mobile unit tests are not added yet.

**Resolution**: Expected for now; will be addressed in Task 5 (add lightweight mobile unit tests).
