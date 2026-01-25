import type { Mode, Preference } from "@quickstart/shared";
import type { StorageSnapshot } from "@quickstart/storage";
import { Header } from "../components/header";
import { PageLayout } from "../components/layout";
import { Section } from "../components/section";
import { useAppContext } from "../data/app-context";

const modeOptions: Mode[] = ["do", "decide", "drift"];

const downloadJson = (snapshot: StorageSnapshot) => {
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "quickstart-export.json";
  anchor.click();
  URL.revokeObjectURL(url);
};

export const SettingsPage = () => {
  const { preferences, updatePreferences, replaceSnapshot, ...state } = useAppContext();
  const snapshot = {
    items: state.items,
    rules: state.rules,
    sessions: state.sessions,
    preferences,
  } satisfies StorageSnapshot;

  const handleUpload = async (file: File | null) => {
    if (!file) {
      return;
    }
    const text = await file.text();
    const parsed = JSON.parse(text) as StorageSnapshot;
    replaceSnapshot(parsed);
  };

  const updateCaps = (next: Partial<Preference["caps"]>) => {
    updatePreferences({
      ...preferences,
      caps: { ...preferences.caps, ...next },
    });
  };

  return (
    <PageLayout>
      <Header />
      <Section title="Preferences">
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Do cap</span>
            <input
              type="number"
              min={1}
              value={preferences.caps.doMax}
              onChange={(event) => updateCaps({ doMax: Number(event.target.value) })}
            />
          </label>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Decide cap</span>
            <input
              type="number"
              min={1}
              value={preferences.caps.decideMax}
              onChange={(event) => updateCaps({ decideMax: Number(event.target.value) })}
            />
          </label>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Drift cap</span>
            <input
              type="number"
              min={1}
              value={preferences.caps.driftMax}
              onChange={(event) => updateCaps({ driftMax: Number(event.target.value) })}
            />
          </label>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Widget primary mode</span>
            <select
              value={preferences.widgetConfig.smallWidgetMode}
              onChange={(event) =>
                updatePreferences({
                  ...preferences,
                  widgetConfig: {
                    ...preferences.widgetConfig,
                    smallWidgetMode: event.target.value as Mode,
                  },
                })
              }
            >
              {modeOptions.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Section>
      <Section title="Export / Import">
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => downloadJson(snapshot)}
            style={{
              padding: "0.5rem 0.9rem",
              borderRadius: "999px",
              border: "1px solid #111827",
              background: "#111827",
              color: "#ffffff",
            }}
          >
            Export JSON
          </button>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Import JSON</span>
            <input
              type="file"
              accept="application/json"
              onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </Section>
    </PageLayout>
  );
};
