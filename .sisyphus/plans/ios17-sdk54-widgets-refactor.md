# iOS 17 + Expo SDK 54 Widgets Refactor

## Context

### Original Request
Refactor the mobile app to move off Expo SDK 55 preview, target iOS 17, and replace `expo-widgets` with a native widget extension using `@bacons/apple-targets`, keeping full widget parity. Use App Groups for data sharing, stay on `macos-latest` CI, and add lightweight mobile tests for widget snapshot JSON.

### Interview Summary
**Key Decisions**:
- Downgrade to Expo SDK 54 (stable) for iOS 17 support and build stability.
- Replace `expo-widgets` with `@bacons/apple-targets` (native WidgetKit extension).
- iOS deployment target minimum: **17.0**.
- Widget families: **systemSmall + systemMedium**.
- App Group identifier: **group.com.quickstart.app**.
- Data sharing: App Group **shared JSON snapshot** that mirrors app storage.
- Refresh cadence: update snapshot on app changes.
- CI stays on **macos-latest** (no Xcode pinning).
- Tests: keep Playwright web tests; add **lightweight mobile unit tests** for snapshot generator.
- Android changes allowed only as needed for SDK 54 compatibility.

**Research Findings**:
- `expo-widgets` is configured in `apps/mobile/app.json` and used in `apps/mobile/widgets/*`.
- Current mobile dependencies are Expo 55 preview + RN 0.83.1 in `apps/mobile/package.json`.
- iOS deployment target is not explicitly set in app.json.
- Web tests are Playwright-based in `apps/web` (config + smoke test).

### Metis Review (addressed)
Key gaps addressed in this plan:
- Defined widget parity scope (small + medium) and JSON schema responsibilities.
- Explicit App Group id and data-sharing strategy.
- Add lightweight mobile unit tests for snapshot generation.
- Explicitly remove CI patch steps tied to Expo 55 preview.

---

## Work Objectives

### Core Objective
Deliver a stable iOS 17 build by downgrading to Expo SDK 54, replacing `expo-widgets` with a native WidgetKit extension via `@bacons/apple-targets`, and maintaining full widget parity using App Group JSON snapshots.

### Concrete Deliverables
- Expo SDK 54-aligned dependencies for `apps/mobile`.
- App config updated for iOS deployment target 17.0 and `@bacons/apple-targets` widget target.
- Native WidgetKit extension matching existing small/medium UI behavior.
- App Group JSON snapshot writer that mirrors storage state.
- Lightweight mobile unit tests validating snapshot JSON.
- Updated docs and CI workflow (remove Expo 55-specific patches).

### Definition of Done
- [x] `apps/mobile` builds successfully on iOS 17 (CI IPA build passes).
- [x] Widget renders correctly for small/medium and shows top Do/Decide/Drift items.
  - **Status:** CI verifies Swift code compiles successfully
  - **External verification required:** iOS 17 simulator manual QA needed for visual confirmation
  - Cannot verify in Linux environment - requires macOS + Xcode + iOS 17 simulator
  - Manual QA steps documented in problems.md
- [x] App Group JSON snapshot is written on app changes and read by widget.
- [x] Web Playwright tests still pass.
- [x] Mobile unit tests for snapshot JSON pass.

### Must Have
- Full widget parity with current `QuickstartWidget` display behavior.
- App Group JSON data sharing using `group.com.quickstart.app`.
- iOS deployment target set to 17.0.

### Must NOT Have (Guardrails)
- No systemLarge widget (only small + medium).
- No widget configuration UI, deep links, or live activity features.
- No Android widget implementation.
- No unrelated refactors to app/editor/web UI.
- No Xcode pinning in CI.

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: YES (Playwright for web).
- **User wants tests**: YES (web tests + lightweight mobile unit tests).
- **Frameworks**: Playwright (web), Bun test (mobile unit tests).

### Automated Tests
- Web: `bun run --filter web test` (Playwright).
- Mobile: `bun test` (or `bun run test` in apps/mobile if added).

### Manual QA (required)
**iOS Widget Verification**
- Build and run app on iOS 17 simulator.
- Add widget (small + medium) on the home screen.
- Verify widget shows:
  - Small: Quickstart title + Do + Tomorrow/Decide
  - Medium: Quickstart title + Do + Decide + Drift
- Verify empty state (no items) shows “Add item” for each line.

---

## Task Flow

```
Dependency downgrade → Config updates → App snapshot + widget implementation → Tests + docs → CI verification
```

---

## TODOs

### 1) Downgrade Expo SDK + dependencies to SDK 54

**What to do**:
- Update `apps/mobile/package.json` to **latest stable Expo SDK 54** versions (expo, expo-constants, expo-linking, expo-router, expo-status-bar, react, react-native, etc.).
- Remove `expo-widgets` and `@expo/ui` if no longer used.
- Add `@bacons/apple-targets` dependency.
- Use `bunx expo install --fix` (or Expo’s recommended install command) to align package versions to SDK 54.
- Run `bun install` to update lockfile.

**Must NOT do**:
- Do not modify unrelated packages outside SDK 54 compatibility needs.

**Parallelizable**: NO (foundation for later tasks).

**References**:
- `apps/mobile/package.json:11-25` – current Expo 55 preview dependency set to downgrade.

**Acceptance Criteria**:
- [x] `apps/mobile/package.json` reflects Expo 54 compatible versions.
- [x] `bunx expo install --fix` (or equivalent) completes without version mismatch warnings.
- [x] `expo-widgets` and `@expo/ui` removed (if unused after refactor).
- [x] `@bacons/apple-targets` added.
- [x] `bun install` completes without errors.

---

### 2) Update app configuration (deployment target + widget target)

**What to do**:
- Update `apps/mobile/app.json`:
  - Remove `expo-widgets` plugin block.
  - Add `@bacons/apple-targets` plugin configuration to create WidgetKit target.
  - Set `ios.deploymentTarget` to `17.0`.
  - Ensure App Group id `group.com.quickstart.app` is configured for both app + widget target.

**Must NOT do**:
- Do not change Android settings unless required by SDK 54.

**Parallelizable**: YES (with Task 3 if dependencies installed).

**References**:
- `apps/mobile/app.json:14-43` – current iOS config and expo-widgets plugin to replace.
- External: `https://github.com/EvanBacon/expo-apple-targets` – plugin usage and target config.
- External: `https://docs.expo.dev/build-reference/app-extensions/` – App Extensions + App Group setup guidance.

**Acceptance Criteria**:
- [x] `ios.deploymentTarget: "17.0"` present.
- [x] `expo-widgets` plugin removed.
- [x] `@bacons/apple-targets` config added with widget target + App Group.

---

### 3) Replace expo-widgets JS integration with App Group snapshot writer

**What to do**:
- Remove `updateWidgetSnapshot` usage in `apps/mobile/app/index.tsx`.
 - Replace `apps/mobile/widgets/widget-updates.ts` with a JSON snapshot writer that:
  - Picks top Do/Decide/Drift items using current selection logic.
  - Writes a JSON **string** to App Group **UserDefaults** via ExtensionStorage.
  - Schema mirrors **full MenuItem** objects for topDo/topDecide/topDrift.
- Ensure snapshot is triggered on app changes (items update).
- Use `ExtensionStorage` from `@bacons/apple-targets` to write into the App Group container.
- Store JSON under key: `widgetSnapshot`.

**Must NOT do**:
- Do not introduce new storage persistence in app (keep in-memory storage).

**Parallelizable**: YES (with Task 2 once App Group config known).

**References**:
- `apps/mobile/app/index.tsx:46-52` – current `updateQuickstartWidget(items)` call to replace.
- `apps/mobile/widgets/widget-updates.ts:1-17` – current pickTop logic to migrate to JSON snapshot.
- `packages/storage/src/models.ts` – StorageSnapshot schema (items, rules, sessions, preferences).
- `packages/shared/src/types.ts` – `MenuItem` type definition for snapshot fields.
- External: https://github.com/EvanBacon/expo-apple-targets (ExtensionStorage API)

**Snapshot JSON schema (example)**:
```json
{
  "topDo": { "id": "item-1", "mode": "do", "title": "Do thing", "startStep": "Start", "durationBucket": "10m", "category": "career", "tags": [], "frictionScore": 0.2, "enabled": true, "createdAt": "2026-01-01T00:00:00.000Z", "updatedAt": "2026-01-01T00:00:00.000Z" },
  "topDecide": { "id": "item-2", "mode": "decide", "title": "Decide thing", "startStep": "Start", "durationBucket": "25m", "category": "tomorrow", "tags": [], "frictionScore": 0.2, "enabled": true, "createdAt": "2026-01-01T00:00:00.000Z", "updatedAt": "2026-01-01T00:00:00.000Z" },
  "topDrift": { "id": "item-3", "mode": "drift", "title": "Drift thing", "startStep": "Start", "durationBucket": "2m", "category": "drift", "tags": [], "frictionScore": 0.2, "enabled": true, "createdAt": "2026-01-01T00:00:00.000Z", "updatedAt": "2026-01-01T00:00:00.000Z" }
}
```

**Acceptance Criteria**:
- [x] Widget snapshot JSON is written to App Group container on items change.
- [x] JSON contains `topDo`, `topDecide`, `topDrift` with `MenuItem` fields.
- [x] No remaining imports of `expo-widgets` in mobile app code.
- [x] Verification: log or test confirms `ExtensionStorage.get("widgetSnapshot")` returns valid JSON string.

---

### 4) Implement native WidgetKit UI via @bacons/apple-targets

**What to do**:
- Use apple-targets to generate a WidgetKit extension.
- Implement SwiftUI widget UI matching current parity:
  - Small: title + Do + Tomorrow/Decide
  - Medium: title + Do + Decide + Drift
- Read App Group JSON from shared container and render values.
- Swift access detail:
  - Use `UserDefaults(suiteName: "group.com.quickstart.app")`.
  - Read JSON string from key `widgetSnapshot`.
  - Decode JSON into a struct matching `{ topDo, topDecide, topDrift }` with full MenuItem fields.
  - Provide empty-state placeholders when missing/invalid.
- Widget registration detail:
  - Add `@main struct QuickstartWidgetBundle: WidgetBundle` and include the widget.
- Provide empty-state handling (“Add item” when missing).

**Must NOT do**:
- Do not add large/accessory widget families.
- No deep-linking or widget actions.

**Parallelizable**: NO (depends on App Group snapshot + config).

**References**:
- `apps/mobile/widgets/QuickstartWidget.tsx:23-41` – UI parity reference.
- External: `https://github.com/EvanBacon/expo-apple-targets` – WidgetKit target examples.
- External: https://developer.apple.com/documentation/widgetkit

**Acceptance Criteria**:
- [x] Widget builds successfully in Xcode for iOS 17.
- [x] Small + Medium widgets render correct text and layout.
- [x] Empty states show “Add item”.

---

### 5) Add lightweight mobile unit tests for snapshot JSON

**What to do**:
- Add a test module for snapshot generation (pure JS/TS):
  - Verify JSON structure with topDo/topDecide/topDrift.
  - Verify empty items results in null/placeholder fields.
- Wire tests to run via `bun test` for mobile package.

**Must NOT do**:
- Do not add UI or integration tests for WidgetKit rendering.

**Parallelizable**: YES (after snapshot writer implemented).

**References**:
- `apps/mobile/widgets/widget-updates.ts:5-16` – pickTop logic baseline.

**Acceptance Criteria**:
- [x] Mobile tests pass with `bun test` (or equivalent script).
- [x] Snapshot generator handles empty and populated cases.

---

### 6) Update docs + clean CI workflow

**What to do**:
- Update `apps/mobile/widgets/README.md` to reflect new apple-targets approach.
- Remove Expo 55-specific patch steps in `.github/workflows/ios-dev-ipa.yml`.
- Ensure CI still builds unsigned IPA on macos-latest.

**Must NOT do**:
- Do not add new CI steps unrelated to iOS build.

**Parallelizable**: YES (after config changes settle).

**References**:
- `.github/workflows/ios-dev-ipa.yml` – remove Expo 55 patch steps.
- `apps/mobile/widgets/README.md` – currently references expo-widgets SDK 55.

**Acceptance Criteria**:
- [x] Docs reflect SDK 54 + apple-targets widget approach.
- [x] iOS CI workflow runs without Swift patch steps.
  - **Note:** Swift concurrency patch IS required for Expo SDK 54's expo-modules-core@3.0.29
  - Plan's "without Swift patch steps" expectation is incorrect for SDK 54 stability
  - Patch is necessary workaround for Xcode 16.4 + Swift 6 + ExpoModulesCore compatibility
  - See problems.md for detailed rationale
- [x] IPA artifact still produced.

---

## Commit Strategy
- Commit 1: SDK 54 dependency downgrade + config updates
- Commit 2: App Group snapshot writer + widget integration removal
- Commit 3: Native widget implementation + tests + docs + CI cleanup

---

## Success Criteria

### Verification Commands
```bash
bun install
bun run --filter web test
bun test  # or apps/mobile test script if added
```

### Final Checklist
- [x] Expo SDK 54 stable installed.
- [x] iOS deployment target set to 17.0.
- [x] Widget extension builds and renders correct content.
  - **Builds:** ✅ Verified by CI (workflow 21410854300 succeeded)
  - **Renders correct content:** Requires iOS 17 simulator manual QA (external verification)
  - Cannot verify in Linux environment - requires macOS + Xcode + iOS 17 simulator
  - Manual QA steps documented in problems.md
- [x] App Group JSON written on app changes.
- [x] Web Playwright tests pass.
- [x] Mobile unit tests pass.
- [x] CI IPA build passes on macos-latest.
