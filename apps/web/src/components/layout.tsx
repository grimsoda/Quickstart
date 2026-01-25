import type { ReactNode } from "react";

export const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        color: "#0f172a",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gap: "1.5rem",
        }}
      >
        {children}
      </div>
    </div>
  );
};
