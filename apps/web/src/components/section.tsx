import type { ReactNode } from "react";

export const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <section
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
        display: "grid",
        gap: "1rem",
      }}
    >
      <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{title}</div>
      <div style={{ display: "grid", gap: "0.75rem" }}>{children}</div>
    </section>
  );
};
