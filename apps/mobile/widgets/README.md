# Quickstart Widgets (SDK 54)

This project uses `@bacons/apple-targets` with native WidgetKit for iOS widgets. This approach is compatible with Expo SDK 54 and requires iOS 17.0+.

## Architecture

The widget is implemented using native Swift code and communicates with the main React Native app via **App Groups**.

- **Deployment Target**: iOS 17.0
- **App Group**: `group.com.quickstart.app`
- **Data Flow**:
  1. The React Native app generates a JSON snapshot of the widget data.
  2. The app writes this JSON string to the App Group's `UserDefaults` using the key `widgetSnapshot`.
  3. The native WidgetKit extension reads the JSON string, decodes it, and renders the UI.

### Supported Families

The widget supports the following sizes:
- `systemSmall`: Displays the top "Do" and "Tomorrow" (top Decide) items.
- `systemMedium`: Displays the top "Do", "Decide", and "Drift" items.

## Snapshot Structure

The `widgetSnapshot` key in `UserDefaults` contains a JSON object with the following structure:

```json
{
  "topDo": { "title": "First item" },
  "topDecide": { "title": "Second item" },
  "topDrift": { "title": "Third item" }
}
```

If no items are available for a specific mode, the value will be `null` or the key will be missing. The widget handles these states by displaying "Add item".

## Configuration

The widget target is configured in `apps/mobile/targets/widget/expo-target.config.js`.

The native implementation is located at `apps/mobile/targets/widget/QuickstartWidget.swift`.

## Simulator Testing (macOS)

1. Ensure you have Xcode installed and the iOS 17.0+ simulator ready.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Run the development server:
   ```bash
   bun run start
   ```
4. Build and run the app on the simulator:
   ```bash
   # In apps/mobile
   npx expo run:ios
   ```
5. On the simulator home screen, long-press and add the "QuickstartWidget".

## Development

- **Logic**: Snapshot generation logic is in `apps/mobile/widgets/widget-snapshot.ts`.
- **I/O**: App Group storage operations are in `apps/mobile/widgets/widget-updates.ts`.
- **Tests**: Run unit tests with `bun test apps/mobile/widgets/widget-updates.test.ts`.
