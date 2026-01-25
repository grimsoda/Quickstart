import type { MenuItem } from "@quickstart/shared";
import React from "react";

type MenuItemCardProps = {
  item: MenuItem;
  onEdit?: (item: MenuItem) => void;
  onStart?: (item: MenuItem) => void;
};

export const MenuItemCard = ({ item, onEdit, onStart }: MenuItemCardProps) => {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "1rem",
        background: "#ffffff",
        display: "grid",
        gap: "0.5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <div style={{ fontWeight: 600 }}>{item.title}</div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>{item.startStep}</div>
        </div>
        <span
          style={{
            alignSelf: "start",
            background: "#f3f4f6",
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            fontSize: "0.75rem",
          }}
        >
          {item.durationBucket}
        </span>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {item.tags.map((tag: string) => (
          <span
            key={tag}
            style={{
              fontSize: "0.7rem",
              color: "#1f2937",
              background: "#e5e7eb",
              padding: "0.15rem 0.5rem",
              borderRadius: "999px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {onStart && (
          <button
            type="button"
            onClick={() => onStart(item)}
            style={{
              padding: "0.45rem 0.85rem",
              borderRadius: "10px",
              border: "none",
              background: "#111827",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Start
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(item)}
            style={{
              padding: "0.45rem 0.85rem",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};
