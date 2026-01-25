import type { MenuItem } from "@quickstart/shared";
import React from "react";

type DriftCardProps = {
  item: MenuItem;
  onStart?: (item: MenuItem) => void;
};

export const DriftCard = ({ item, onStart }: DriftCardProps) => {
  return (
    <div
      style={{
        border: "1px dashed #d1d5db",
        borderRadius: "16px",
        padding: "1rem",
        background: "#ffffff",
        display: "grid",
        gap: "0.65rem",
      }}
    >
      <div style={{ fontWeight: 600 }}>{item.title}</div>
      <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>{item.startStep}</div>
      {onStart && (
        <button
          type="button"
          onClick={() => onStart(item)}
          style={{
            justifySelf: "start",
            padding: "0.4rem 0.75rem",
            borderRadius: "10px",
            border: "1px solid #9ca3af",
            background: "#f9fafb",
            cursor: "pointer",
          }}
        >
          Start drift
        </button>
      )}
    </div>
  );
};
