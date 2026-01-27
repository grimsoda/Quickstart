# Learnings

## 2026-01-27: CI IPA Build Succeeds with SDK 54 and Widget Extension

**Status:** ✅ SUCCESS

**Workflow Run:** `ios-dev-ipa` (ID: 21410854300)
**Branch:** `sdk54-widgets-refactor`
**Duration:** 8m 18s
**Artifact:** `quickstart-unsigned-ipa` (produced successfully)

### Critical Fixes Applied

1. **Fixed regex pattern for Swift concurrency patch** (commit: 0b45f33)
   - Issue: Original pattern didn't account for `: NSObject` inheritance in class declaration
   - Fix: Updated regex to `r'^(\s*)(public\s+)?(final\s+)?class\s+ExpoAppDelegateSubscriberManager\b[^{]*\{'`
   - Result: Pattern now matches class with inheritance: `public class ExpoAppDelegateSubscriberManager: NSObject {`

2. **Clean install dependencies in CI** (commit: fefb007)
   - Issue: CI was only cleaning root `node_modules` and `bun.lock`, but `apps/mobile/node_modules` also needed cleaning after SDK downgrade
   - Fix: Added `rm -rf apps/mobile/node_modules apps/mobile/bun.lock` to CI install step

3. **Clean Bun cache directory** (commit: 83c69a3)
   - Issue: Bun workspace caches dependencies in `node_modules/.bun` cache directory, which persisted stale SDK 55 preview versions (like `babel-preset-expo@55.0.1`)
   - Fix: Added `rm -rf node_modules/.bun` to clean Bun cache before `bun install`
   - Result: Fresh install ensures only SDK 54 compatible dependencies are cached

4. **Added babel-preset-expo to root dependencies** (commit: 6f78072)
   - Issue: Expo bundler during iOS build couldn't resolve `babel-preset-expo` from Bun cache
   - Error: `Cannot find module 'babel-preset-expo'` during metro bundle step
   - Root cause: Bun workspace doesn't hoist root-level packages like `babel-preset-expo` to cache for bundler access
   - Fix: Added `"babel-preset-expo": "~54.0.10"` to root `package.json` dependencies
   - Result: Ensures `babel-preset-expo` is available at monorepo root for Expo bundler resolution

### Verification Results

- ✅ Patch step completed successfully
- ✅ `expo prebuild` completed without errors
- ✅ `pod install` completed without errors
- ✅ `xcodebuild` compiled all targets successfully
- ✅ Bundle step (`expo export:embed`) completed without errors
- ✅ IPA artifact `quickstart-unsigned-ipa` produced and uploaded
- ✅ Build exit code: 0 (success)

### Remaining Tasks (External Verification Required)

The CI build now succeeds, but there are still 3 plan items that require **external verification**:

1. **Widget renders correctly for small/medium** - Requires macOS/Xcode iOS 17 simulator to visually verify:
   - Small widget: Quickstart title + Do + Tomorrow/Decide
   - Medium widget: Quickstart title + Do + Decide + Drift
   - Empty states: "Add item" when no items

2. **Widget builds successfully in Xcode for iOS 17** - Confirmed by CI build success:
   - ✅ Widget extension compiled successfully
   - ✅ WidgetKit code linked correctly
   - ⚠️  Manual Xcode build verification still needed for parity check

3. **CI IPA build passes on macos-latest** - ✅ Completed (workflow run 21410854300)

### Key Technical Decisions

- **CI Workflow Strategy:** Clean install strategy (remove all caches before install) is essential for SDK downgrades in monorepos
- **Bun Cache Behavior:** Bun uses `node_modules/.bun` as cache; must be cleaned to avoid version conflicts
- **Dependency Hoisting:** Adding critical dependencies (like babel-preset-expo) to root ensures bundler can resolve them regardless of workspace structure
- **Regex Robustness:** Class declaration regex must account for optional modifiers (`public`, `final`) and inheritance (`: NSObject`)

### Plan Impact

- ✅ Task 6.1: "CI IPA build passes on macos-latest" - COMPLETED
- ✅ Task 6.2: "IPA artifact still produced" - COMPLETED
- ⏸️  Task 6: "iOS CI workflow runs without Swift patch steps" - UNCHECKED (intentional - SDK 54 requires patch)
- ⏸️  Task 4: "Widget builds successfully in Xcode" - PARTIALLY VERIFIED (CI builds, manual Xcode verification still pending)
- ⏸️  Task 4.1: "Widget renders correctly for small/medium" - REQUIRES MACOS SIMULATOR
