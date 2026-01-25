export const EmptyState = ({ message }: { message: string }) => {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "12px",
        border: "1px dashed #d1d5db",
        background: "#f9fafb",
        color: "#6b7280",
      }}
    >
      {message}
    </div>
  );
};
