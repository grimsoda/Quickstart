# Quickstart

Monorepo for the Quickstart Do/Decide/Drift app.

## Requirements

- Bun
- Xcode (for iOS simulator builds)

## Install

```bash
bun install
```

## Development

```bash
# web
bun run --filter web dev

# mobile
bun run --filter mobile start
```

## Build

```bash
# web
bun run --filter web build
```

## iOS IPA (GitHub Actions)

The workflow `.github/workflows/ios-dev-ipa.yml` builds an **unsigned** IPA on a macOS
runner and uploads it as a build artifact (intended for TrollStore-style sideloading).

Run it from the Actions tab: **ios-dev-ipa → Run workflow**.

## Test

```bash
# web tests
bun run --filter web test
```

## Troubleshooting iOS Crashes

### Capturing Device Logs

**Method 1: macOS Console.app (Easiest)**
1. Connect iPhone to Mac via USB
2. Open Console.app (Applications → Utilities)
3. Select your device from "Devices" sidebar
4. Filter by "Quickstart" or "Widget"

**Method 2: idevicesyslog (Terminal)**
```bash
# Install (one-time)
brew install libimobiledevice

# Stream all device logs
idevicesyslog

# Filter by process name
idevicesyslog | grep -E "(Quickstart|Widget)"
```

### Common Crash Patterns

| Crash Location | Last Log Before Crash | Fix |
|---------------|----------------------|-----|
| **Widget force unwrap** | `[com.quickstart.app.Widget] getTimeline called...` then crash | Add `guard let` in Swift widget code |
| **ExtensionStorage crash** | `[Quickstart App] Widget update failed: ...` | Check App Groups entitlement |
| **UserDefaults access** | `[com.quickstart.app.Widget] loadEntry - failed to access UserDefaults` | Check bundle identifier match |
| **Deep link error** | `Cannot make a deep link into a standalone app with no custom scheme defined` | Add `"scheme": "quickstart"` to app.json |
| **Crypto API error** | `ReferenceError: Property 'crypto' doesn't exist` | Replace `crypto.randomUUID()` with `Math.random()`-based UUID generator |

### Known Issues & Fixes

**Issue 1: Widget Force Unwrap Crash**
- **Status:** ✅ Fixed
- **File:** `apps/mobile/targets/widget/QuickstartWidget.swift`
- **Fix:** Removed force unwrap (`!`) from calendar date access, added `guard let` with fallback

**Issue 2: Deep Link Crash**
- **Status:** ✅ Fixed
- **Error:** `Cannot make a deep link into a standalone app with no custom scheme defined`
- **Fix:** Added `"scheme": "quickstart"` to `app.json`

**Issue 3: Crypto API Crash**
- **Status:** ✅ Fixed
- **Error:** `ReferenceError: Property 'crypto' doesn't exist`
- **Root Cause:** `crypto.randomUUID()` is a Node.js Web Crypto API not available in React Native
- **File:** `packages/storage/src/defaults.ts`
- **Fix:** Created `packages/storage/src/uuid.ts` with Math.random()-based UUID v4 generator

### Widget Logs Explained

Widget logs use this format:
```
[com.quickstart.app.Widget] <method> - <description>
```

**Methods:**
- `getTimeline` - Requesting widget timeline data
- `loadEntry` - Loading data from UserDefaults (app group storage)
- `placeholder` - Generating entry placeholder when no data available
- `getSnapshot` - Retrieving current app state

**Sample Working Logs:**
```
[com.quickstart.app.Widget] getTimeline called - loading entry for timeline
[com.quickstart.app.Widget] loadEntry called - attempting to load data from UserDefaults
[com.quickstart.app.Widget] loadEntry - successfully accessed UserDefaults
[com.quickstart.app.Widget] loadEntry - found JSON string in UserDefaults: {"topDo":{"title":"Task 1"}...
[com.quickstart.app.Widget] loadEntry - successfully decoded JSON snapshot
[com.quickstart.app.Widget] getTimeline - creating timeline with entry
```

### Testing on Device

1. Build latest IPA from CI
2. Download and install on iOS 17 device
3. Start log capture (Console.app or idevicesyslog)
4. Launch app
5. Observe logs for expected patterns above
