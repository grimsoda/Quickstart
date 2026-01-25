import type { Mode } from "@quickstart/shared";
import React from "react";

type ModeSwitchProps = {
  value: Mode;
  onChange: (mode: Mode) => void;
};

const modes: { value: Mode; label: string }[] = [
  { value: "do", label: "Do" },
  { value: "decide", label: "Decide" },
  { value: "drift", label: "Drift" },
];

export const ModeSwitch = ({ value, onChange }: ModeSwitchProps) => {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => onChange(mode.value)}
          style={{
            padding: "0.5rem 0.9rem",
            borderRadius: "999px",
            border: "1px solid #d0d7de",
            background: value === mode.value ? "#111827" : "#f9fafb",
            color: value === mode.value ? "#ffffff" : "#111827",
            cursor: "pointer",
          }}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};
