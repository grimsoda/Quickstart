# Decisions

## 2026-01-27: Expo SDK 54 Stable Over Preview

**Decision:** Downgrade from Expo SDK 55 preview to Expo SDK 54 stable

**Rationale:**
- SDK 55 is in preview (55.0.0-preview.x), may have breaking changes
- SDK 54 is the latest stable release with proven compatibility
- Preview packages (@expo/ui, expo-widgets) are experimental and not needed for stable SDK

**Alternative Considered:** Stay on SDK 55 preview
**Rejected:** Preview versions are not production-ready and may introduce instability

## 2026-01-27: Remove expo-widgets and @expo/ui

**Decision:** Remove expo-widgets@55.0.0-alpha.2 and @expo/ui from dependencies

**Rationale:**
- These are experimental/beta packages for SDK 55 preview
- Not compatible with stable SDK 54
- expo-widgets is alpha version and unstable
- @expo/ui is beta version with unknown stability

**Impact:** No features broken - these packages were not in use

## 2026-01-27: Add @bacons/apple-targets

**Decision:** Add @bacons/apple-targets@^3.0.7 to dependencies

**Rationale:**
- Automatic management of iOS bundleIdentifier and groupIdentifier
- Eliminates manual configuration in Info.plist
- Recommended for iOS projects using Expo SDK 54
- Prevents build failures from mismatched identifiers

**Alternative:** Manual configuration in Info.plist
**Rejected:** Manual configuration is error-prone and requires ongoing maintenance

## 2026-01-27: Configure @bacons/apple-targets in app.json

**Decision:** Configure @bacons/apple-targets plugin for iOS widget target management

**Chosen Config Shape:**
```json
{
  "ios": {
    "deploymentTarget": "17.0",
    "entitlements": {
      "com.apple.security.application-groups": [
        "group.com.quickstart.app"
      ]
    }
  },
  "plugins": [
    "expo-router",
    "@bacons/apple-targets"
  ]
}
```

**Rationale:**
- ios.deploymentTarget: "17.0" sets minimum iOS version for widget support
- ios.entitlements['com.apple.security.application-groups'] declares App Group for data sharing between app and widget
- @bacons/apple-targets plugin manages iOS target configuration automatically
- Plugin replaces expo-widgets plugin block which was alpha/beta preview code

**App Group Configuration:**
- App Group id `group.com.quickstart.app` defined in ios.entitlements
- Will be mirrored to widget target automatically by @bacons/apple-targets
- Widget target will reference same App Group in targets/widget/expo-target.config.js (separate file)
- Enables shared UserDefaults between app and widget for state sync

**Key Design Choices:**
- Minimal app.json config: plugin handles target-specific details
- Widget families (systemSmall, systemMedium) configured in separate expo-target.config.js
- No manual bundleIdentifier for widget - plugin auto-generates sanitized version
- Entitlements in app.json, plugin mirrors to targets during prebuild

## 2026-01-27: Widget Target Config Shape

**Decision:** Use function-based config in targets/widget/expo-target.config.js for @bacons/apple-targets

**Chosen Config Shape:**
```javascript
/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "widget",
  name: "QuickstartWidget",
  entitlements: {
    "com.apple.security.application-groups":
      config.ios.entitlements["com.apple.security.application-groups"],
  },
  deploymentTarget: "17.0",
  bundleIdentifier: ".widget",
});
```

**Rationale:**
- Function-based config allows access to Expo config (app.json) for mirroring App Groups
- type: "widget" defines target type for the plugin
- name: "QuickstartWidget" sets widget display name
- entitlements mirrors com.apple.security.application-groups from app.json using config.ios.entitlements
- deploymentTarget: "17.0" matches main app's minimum iOS version
- bundleIdentifier: ".widget" appends suffix to main app's bundleIdentifier (com.quickstart.app)
- No families configuration in config file - plugin doesn't support it, must use Swift code

**Widget Families Configuration:**
- @bacons/apple-targets plugin doesn't support widget families in expo-target.config.js
- Widget families (systemSmall, systemMedium) must be configured in Swift code using supportedFamilies property
- Comment added to config file explaining this limitation
- Widget bundle ID will be: com.quickstart.app.widget (from main bundle id + suffix)

**Design Decision: Function vs Object Config:**
- Chose function-based config to dynamically mirror App Groups from app.json
- Alternative object config would require hardcoding App Group ID
- Function approach prevents drift between app.json and widget config
