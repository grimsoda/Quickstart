import { test, expect, mock } from "bun:test";
import { generateWidgetSnapshot } from "./widget-snapshot";
import type { MenuItem } from "@quickstart/shared";

const mockStorage = new Map<string, string>();

class MockExtensionStorage {
  constructor(appGroup: string) {}

  get(key: string): string | null {
    return mockStorage.get(key) ?? null;
  }

  set(key: string, value: string | number | Record<string, unknown>): void {
    mockStorage.set(key, String(value));
  }
}

mock.module("@bacons/apple-targets", () => ({
  ExtensionStorage: MockExtensionStorage,
}));

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

test("generateWidgetSnapshot returns correct structure with all required keys", () => {
  const snapshot = generateWidgetSnapshot([]);

  expect(snapshot).toHaveProperty("topDo");
  expect(snapshot).toHaveProperty("topDecide");
  expect(snapshot).toHaveProperty("topDrift");
});

test("generateWidgetSnapshot picks first matching item for each mode", () => {
  const items: MenuItem[] = [
    { ...mockItem, id: "1", mode: "do", title: "Do Item 1" },
    { ...mockItem, id: "2", mode: "do", title: "Do Item 2" },
    { ...mockItem, id: "3", mode: "decide", title: "Decide Item" },
    { ...mockItem, id: "4", mode: "drift", title: "Drift Item" },
  ];

  const snapshot = generateWidgetSnapshot(items);

  expect(snapshot.topDo).toEqual(items[0]);
  expect(snapshot.topDecide).toEqual(items[2]);
  expect(snapshot.topDrift).toEqual(items[3]);
  expect(snapshot.topDo?.title).toBe("Do Item 1");
});

test("generateWidgetSnapshot returns undefined for missing modes", () => {
  const items: MenuItem[] = [
    { ...mockItem, id: "1", mode: "do" },
  ];

  const snapshot = generateWidgetSnapshot(items);

  expect(snapshot.topDo).toEqual(items[0]);
  expect(snapshot.topDecide).toBeUndefined();
  expect(snapshot.topDrift).toBeUndefined();
});

test("generateWidgetSnapshot returns undefined for empty items array", () => {
  const snapshot = generateWidgetSnapshot([]);

  expect(snapshot.topDo).toBeUndefined();
  expect(snapshot.topDecide).toBeUndefined();
  expect(snapshot.topDrift).toBeUndefined();
});

test("generateWidgetSnapshot output can be serialized to JSON", () => {
  const items: MenuItem[] = [
    { ...mockItem, id: "1", mode: "do", title: "Do Item" },
    { ...mockItem, id: "2", mode: "decide", title: "Decide Item" },
    { ...mockItem, id: "3", mode: "drift", title: "Drift Item" },
  ];

  const snapshot = generateWidgetSnapshot(items);

  expect(() => JSON.stringify(snapshot)).not.toThrow();

  const json = JSON.stringify(snapshot);
  const parsed = JSON.parse(json);

  expect(parsed.topDo.title).toBe("Do Item");
  expect(parsed.topDecide.title).toBe("Decide Item");
  expect(parsed.topDrift.title).toBe("Drift Item");
});

test("generateWidgetSnapshot JSON serialization handles undefined values", () => {
  const items: MenuItem[] = [
    { ...mockItem, id: "1", mode: "do" },
  ];

  const snapshot = generateWidgetSnapshot(items);
  const json = JSON.stringify(snapshot);
  const parsed = JSON.parse(json);

  expect(parsed.topDo).toBeDefined();
  expect(parsed.topDecide).toBeUndefined();
  expect(parsed.topDrift).toBeUndefined();
});

test("ExtensionStorage.get('widgetSnapshot') returns valid JSON string", () => {
  const { ExtensionStorage } = require("@bacons/apple-targets");

  const items: MenuItem[] = [
    { ...mockItem, id: "1", mode: "do", title: "Do Item" },
    { ...mockItem, id: "2", mode: "decide", title: "Decide Item" },
    { ...mockItem, id: "3", mode: "drift", title: "Drift Item" },
  ];

  const storage = new ExtensionStorage("group.com.quickstart.app");
  const snapshot = generateWidgetSnapshot(items);
  storage.set("widgetSnapshot", JSON.stringify(snapshot));

  const retrieved = storage.get("widgetSnapshot");

  expect(retrieved).not.toBeNull();
  expect(typeof retrieved).toBe("string");

  const parsed = JSON.parse(retrieved!);
  expect(parsed).toHaveProperty("topDo");
  expect(parsed).toHaveProperty("topDecide");
  expect(parsed).toHaveProperty("topDrift");
  expect(parsed.topDo.title).toBe("Do Item");
  expect(parsed.topDecide.title).toBe("Decide Item");
  expect(parsed.topDrift.title).toBe("Drift Item");
});
