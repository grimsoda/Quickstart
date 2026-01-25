import type { Mode } from "@quickstart/shared";

const summaries: Record<Mode, string> = {
  do: "Action menu for immediate starts and short wedges.",
  decide: "One bounded decision at a time. Finish in under 90 seconds.",
  drift: "Bounded recovery with finite choices.",
};

export const ModeSummary = ({ mode }: { mode: Mode }) => {
  return (
    <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>{summaries[mode]}</div>
  );
};
