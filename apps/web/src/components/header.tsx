export const Header = () => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>Quickstart</div>
        <div style={{ color: "#6b7280" }}>Do · Decide · Drift</div>
      </div>
      <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <a href="/" style={{ color: "#111827", textDecoration: "none" }}>
          Menu
        </a>
        <a href="/editor" style={{ color: "#111827", textDecoration: "none" }}>
          Item editor
        </a>
        <a href="/settings" style={{ color: "#111827", textDecoration: "none" }}>
          Settings
        </a>
      </nav>
    </header>
  );
};
