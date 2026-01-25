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
