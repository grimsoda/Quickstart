# Expo Widgets (SDK 55+)

This project is scaffolded for `expo-widgets` (SDK 55 preview).

## Why widgets are stubbed

`expo-widgets@55.0.0-alpha.2` is installed via:

```bash
bunx expo install expo-widgets@55.0.0-alpha.2
```

## Upgrade steps (when SDK 55 is available in npm)

1. Install Expo SDK 55 (example):

```bash
bunx expo install "expo@~55" "expo-status-bar@~3" "react-native@~0.83"
```

2. Install expo-widgets:

```bash
bunx expo install expo-widgets
```

3. Ensure `ios.bundleIdentifier` is set in `app.json`.

## Simulator testing (macOS)

1. `bun run start` in `apps/mobile`
2. Build dev client with EAS simulator profile:

```bash
eas build --platform ios --profile ios-simulator
eas build:run --platform ios
```

3. Add the widget on the iOS Simulator home screen.
