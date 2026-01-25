import type { MenuItem, MenuCategory, Mode } from "@quickstart/shared";
import { EmptyState } from "../components/empty-state";
import { Header } from "../components/header";
import { PageLayout } from "../components/layout";
import { Section } from "../components/section";
import { useAppContext } from "../data/app-context";

const categories: MenuCategory[] = ["career", "tomorrow", "drift"];
const modes: Mode[] = ["do", "decide", "drift"];
const buckets: MenuItem["durationBucket"][] = ["2m", "10m", "25m"];

export const EditorPage = () => {
  const { items, addItem, updateItem, deleteItem } = useAppContext();

  const createEmptyItem = (): MenuItem => ({
    id: crypto.randomUUID(),
    mode: "do",
    title: "",
    startStep: "",
    durationBucket: "2m",
    category: "career",
    tags: [],
    frictionScore: 1,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleAdd = () => {
    addItem(createEmptyItem());
  };

  return (
    <PageLayout>
      <Header />
      <Section title="Item editor">
        <button
          type="button"
          onClick={handleAdd}
          style={{
            padding: "0.5rem 0.9rem",
            borderRadius: "999px",
            border: "1px solid #111827",
            background: "#111827",
            color: "#ffffff",
          }}
        >
          Add item
        </button>
        {items.length === 0 && (
          <EmptyState message="No items yet. Add your first menu item." />
        )}
        {items.map((item: MenuItem) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "1rem",
              display: "grid",
              gap: "0.75rem",
            }}
          >
            <input
              type="text"
              value={item.title}
              onChange={(event) =>
                updateItem({ ...item, title: event.target.value, updatedAt: new Date().toISOString() })
              }
              placeholder="Title"
              style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
            <input
              type="text"
              value={item.startStep}
              onChange={(event) =>
                updateItem({
                  ...item,
                  startStep: event.target.value,
                  updatedAt: new Date().toISOString(),
                })
              }
              placeholder="Start step (required)"
              style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem" }}>
              <label style={{ display: "grid", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Mode</span>
                <select
                  value={item.mode}
                  onChange={(event) =>
                    updateItem({ ...item, mode: event.target.value as Mode, updatedAt: new Date().toISOString() })
                  }
                >
                  {modes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Category</span>
                <select
                  value={item.category}
                  onChange={(event) =>
                    updateItem({
                      ...item,
                      category: event.target.value as MenuCategory,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Duration</span>
                <select
                  value={item.durationBucket}
                  onChange={(event) =>
                    updateItem({
                      ...item,
                      durationBucket: event.target.value as MenuItem["durationBucket"],
                      updatedAt: new Date().toISOString(),
                    })
                  }
                >
                  {buckets.map((bucket) => (
                    <option key={bucket} value={bucket}>
                      {bucket}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Tags (comma-separated)</span>
              <input
                type="text"
                value={item.tags.join(", ")}
                onChange={(event) =>
                  updateItem({
                    ...item,
                    tags: event.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                    updatedAt: new Date().toISOString(),
                  })
                }
              />
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                style={{
                  padding: "0.4rem 0.75rem",
                  borderRadius: "10px",
                  border: "1px solid #ef4444",
                  background: "#ffffff",
                  color: "#ef4444",
                }}
              >
                Delete
              </button>
              {!item.startStep && (
                <span style={{ color: "#ef4444", fontSize: "0.8rem" }}>
                  Start step required
                </span>
              )}
            </div>
          </div>
        ))}
      </Section>
    </PageLayout>
  );
};
