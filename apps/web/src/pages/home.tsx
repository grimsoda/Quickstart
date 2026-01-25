import type { MenuItem, Mode } from "@quickstart/shared";
import { selectMenuItems } from "@quickstart/storage";
import { MenuItemCard, DecisionCard, DriftCard, ModeSwitch } from "@quickstart/ui";
import { EmptyState } from "../components/empty-state";
import { Header } from "../components/header";
import { PageLayout } from "../components/layout";
import { ModeSummary } from "../components/mode-summary";
import { Section } from "../components/section";
import { useAppContext } from "../data/app-context";

const modeTitles: Record<Mode, string> = {
  do: "Do mode",
  decide: "Decide mode",
  drift: "Drift mode",
};

const modeWedges: Record<Mode, string> = {
  do: "Start wedge",
  decide: "Pick a decision",
  drift: "Start drift",
};

export const HomePage = () => {
  const { mode, setMode, items, preferences, addSession, setActiveDecision } = useAppContext();

  const selection = selectMenuItems(items, mode, preferences);

  const handleStart = (item: MenuItem) => {
    addSession({
      id: crypto.randomUUID(),
      itemId: item.id,
      startedAt: new Date().toISOString(),
      endedAt: null,
      device: "web",
      outcome: "partial",
    });
  };

  const handleDecision = (item: MenuItem) => {
    setActiveDecision(item.id);
    handleStart(item);
  };

  return (
    <PageLayout>
      <Header />
      <Section title="Mode">
        <ModeSwitch value={mode} onChange={setMode} />
        <ModeSummary mode={mode} />
      </Section>
      <Section title={modeTitles[mode]}>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "999px",
              border: "1px solid #111827",
              background: "#111827",
              color: "#ffffff",
            }}
          >
            {modeWedges[mode]}
          </button>
          <a
            href="/editor"
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Add item
          </a>
        </div>
        {selection.length === 0 && <EmptyState message="No items yet. Add one to get started." />}
        {selection.map((item: MenuItem) => {
          if (mode === "decide") {
            return <DecisionCard key={item.id} item={item} onChoose={handleDecision} />;
          }

          if (mode === "drift") {
            return <DriftCard key={item.id} item={item} onStart={handleStart} />;
          }

          return (
            <MenuItemCard
              key={item.id}
              item={item}
              onStart={handleStart}
              onEdit={() => undefined}
            />
          );
        })}
      </Section>
    </PageLayout>
  );
};
