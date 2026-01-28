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

**Method 1: macOS Console.app**
1. Connect iPhone to Mac via USB
2. Open Console.app (Applications → Utilities)
3. Select your device from "Devices" sidebar
4. Filter by "Quickstart" or "Widget"

**Method 2: idevicesyslog (Cross-Platform CLI)**

``libimobiledevice`` needs to be installed.

```bash
# Stream all device logs
idevicesyslog

# Filter by process name
idevicesyslog | grep -E "(Quickstart|Widget)"
```

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
