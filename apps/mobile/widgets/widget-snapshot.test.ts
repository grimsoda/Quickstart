import { test, expect } from "bun:test";
import { generateWidgetSnapshot } from "./widget-snapshot";
import type { MenuItem } from "@quickstart/shared";

const mockItem: MenuItem = {
  id: "1",
  mode: "do",
  title: "Test Item",
  startStep: "start",
  durationBucket: "25m",
  category: "career",
  tags: [],
  frictionScore: 1,
  enabled: true,
  createdAt: "2026-01-27T00:00:00Z",
  updatedAt: "2026-01-27T00:00:00Z",
};

test("generateWidgetSnapshot returns correct structure for small widget (all 3 modes)", () => {
  const items: MenuItem[] = [
    { ...mockItem, id: "1", mode: "do", title: "Do Item" },
    { ...mockItem, id: "2", mode: "decide", title: "Decide Item" },
    { ...mockItem, id: "3", mode: "drift", title: "Drift Item" },
  ];

  const snapshot = generateWidgetSnapshot(items);

  expect(snapshot).toHaveProperty("topDo");
  expect(snapshot).toHaveProperty("topDecide");
  expect(snapshot).toHaveProperty("topDrift");
  expect(snapshot.topDo?.title).toBe("Do Item");
  expect(snapshot.topDecide?.title).toBe("Decide Item");
  expect(snapshot.topDrift?.title).toBe("Drift Item");
});

test("generateWidgetSnapshot handles missing modes", () => {
  const items: MenuItem[] = [
    { ...mockItem, id: "1", mode: "do", title: "Do Item" },
  ];

  const snapshot = generateWidgetSnapshot(items);

  expect(snapshot.topDo).toBeDefined();
  expect(snapshot.topDo?.title).toBe("Do Item");
  expect(snapshot.topDecide).toBeUndefined();
  expect(snapshot.topDrift).toBeUndefined();
});

test("generateWidgetSnapshot handles empty items array", () => {
  const snapshot = generateWidgetSnapshot([]);

  expect(snapshot.topDo).toBeUndefined();
  expect(snapshot.topDecide).toBeUndefined();
  expect(snapshot.topDrift).toBeUndefined();
});

test("generateWidgetSnapshot output is JSON serializable", () => {
  const items: MenuItem[] = [
    { ...mockItem, id: "1", mode: "do", title: "Do Item" },
    { ...mockItem, id: "2", mode: "decide", title: "Decide Item" },
    { ...mockItem, id: "3", mode: "drift", title: "Drift Item" },
  ];

  const snapshot = generateWidgetSnapshot(items);

  expect(() => JSON.stringify(snapshot)).not.toThrow();

  const json = JSON.stringify(snapshot);
  const parsed = JSON.parse(json);

  expect(parsed).toHaveProperty("topDo");
  expect(parsed).toHaveProperty("topDecide");
  expect(parsed).toHaveProperty("topDrift");
  expect(parsed.topDo.title).toBe("Do Item");
  expect(parsed.topDecide.title).toBe("Decide Item");
  expect(parsed.topDrift.title).toBe("Drift Item");
});
