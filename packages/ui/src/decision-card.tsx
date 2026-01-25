import type { MenuItem } from "@quickstart/shared";
import React from "react";

type DecisionCardProps = {
  item: MenuItem;
  onChoose?: (item: MenuItem) => void;
};

export const DecisionCard = ({ item, onChoose }: DecisionCardProps) => {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "1rem",
        background: "#f9fafb",
        display: "grid",
        gap: "0.65rem",
      }}
    >
      <div style={{ fontWeight: 600 }}>{item.title}</div>
      <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>{item.startStep}</div>
      {onChoose && (
        <button
          type="button"
          onClick={() => onChoose(item)}
          style={{
            justifySelf: "start",
            padding: "0.4rem 0.75rem",
            borderRadius: "10px",
            border: "1px solid #111827",
            background: "#ffffff",
            cursor: "pointer",
          }}
        >
          Choose
        </button>
      )}
    </div>
  );
};
