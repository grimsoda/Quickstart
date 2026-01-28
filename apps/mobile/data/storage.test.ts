import { test, expect, mock } from "bun:test";

const mockStorage = new Map<string, string>();

class MockAsyncStorage {
  async getItem(key: string): Promise<string | null> {
    return mockStorage.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    mockStorage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    mockStorage.delete(key);
  }

  async clear(): Promise<void> {
    mockStorage.clear();
  }

  async getAllKeys(): Promise<readonly string[]> {
    return Array.from(mockStorage.keys());
  }

  async multiGet(keys: readonly string[]): Promise<readonly (string | null)[][]> {
    return keys.map((key) => [key, mockStorage.get(key) ?? null]);
  }

  async multiSet(keyValuePairs: readonly (string | string)[][]): Promise<void> {
    keyValuePairs.forEach(([key, value]) => {
      if (key !== undefined && value !== undefined) {
        mockStorage.set(key, value as string);
      }
    });
  }

  async multiRemove(keys: readonly string[]): Promise<void> {
    keys.forEach((key) => mockStorage.delete(key));
  }
}

mock.module("@react-native-async-storage/async-storage", () => ({
  default: new MockAsyncStorage(),
}));

import {
  loadThemePreference,
  saveThemePreference,
  getEffectiveTheme,
} from "./storage";

test("loadThemePreference returns null for non-existent key", async () => {
  const value = await loadThemePreference();
  expect(value).toBeNull();
});

test("saveThemePreference and loadThemePreference work correctly", async () => {
  await saveThemePreference("dark");
  const value = await loadThemePreference();
  expect(value).toBe("dark");
});

test("saveThemePreference can update existing key", async () => {
  await saveThemePreference("light");
  await saveThemePreference("dark");
  const value = await loadThemePreference();
  expect(value).toBe("dark");
});

test("saveThemePreference accepts 'system' mode", async () => {
  await saveThemePreference("system");
  const value = await loadThemePreference();
  expect(value).toBe("system");
});

test("getEffectiveTheme returns saved light theme", async () => {
  await saveThemePreference("light");
  const theme = await getEffectiveTheme();
  expect(theme).toBe("light");
});

test("getEffectiveTheme returns saved dark theme", async () => {
  await saveThemePreference("dark");
  const theme = await getEffectiveTheme();
  expect(theme).toBe("dark");
});

test("getEffectiveTheme returns system theme when mode is 'system'", async () => {
  await saveThemePreference("system");
  const theme = await getEffectiveTheme("dark");
  expect(theme).toBe("dark");
});

test("getEffectiveTheme returns 'light' as default when no theme is saved", async () => {
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  await AsyncStorage.clear();
  const theme = await getEffectiveTheme();
  expect(theme).toBe("light");
});

test("getEffectiveTheme returns default light when system theme not provided", async () => {
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  await AsyncStorage.clear();
  const theme = await getEffectiveTheme();
  expect(theme).toBe("light");
});

test("AsyncStorage removeItem removes key", async () => {
  await saveThemePreference("dark");
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  await AsyncStorage.removeItem("@theme_preference");
  const value = await loadThemePreference();
  expect(value).toBeNull();
});

test("AsyncStorage clear removes all keys", async () => {
  await saveThemePreference("dark");
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  await AsyncStorage.setItem("otherKey", "value");
  await AsyncStorage.clear();
  const theme = await loadThemePreference();
  const otherValue = await AsyncStorage.getItem("otherKey");
  expect(theme).toBeNull();
  expect(otherValue).toBeNull();
});

test("AsyncStorage getAllKeys returns all stored keys", async () => {
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  await AsyncStorage.clear();
  await AsyncStorage.setItem("theme", "dark");
  await AsyncStorage.setItem("otherKey", "value");
  const keys = await AsyncStorage.getAllKeys();
  expect(keys).toHaveLength(2);
  expect(keys).toContain("theme");
  expect(keys).toContain("otherKey");
});

test("AsyncStorage multiGet returns multiple key-value pairs", async () => {
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  await AsyncStorage.clear();
  await AsyncStorage.setItem("theme", "dark");
  await AsyncStorage.setItem("otherKey", "value");
  const values = await AsyncStorage.multiGet(["theme", "otherKey"]);
  expect(values).toHaveLength(2);
  expect(values[0]).toEqual(["theme", "dark"]);
  expect(values[1]).toEqual(["otherKey", "value"]);
});

test("AsyncStorage multiSet sets multiple key-value pairs", async () => {
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  await AsyncStorage.clear();
  await AsyncStorage.multiSet([
    ["theme", "light"],
    ["otherKey", "value"],
  ]);
  const theme = await AsyncStorage.getItem("theme");
  const other = await AsyncStorage.getItem("otherKey");
  expect(theme).toBe("light");
  expect(other).toBe("value");
});

test("AsyncStorage multiRemove removes multiple keys", async () => {
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  await AsyncStorage.setItem("theme", "dark");
  await AsyncStorage.setItem("otherKey", "value");
  await AsyncStorage.multiRemove(["theme", "otherKey"]);
  const theme = await AsyncStorage.getItem("theme");
  const other = await AsyncStorage.getItem("otherKey");
  expect(theme).toBeNull();
  expect(other).toBeNull();
});

test("AsyncStorage stores values as strings", async () => {
  await saveThemePreference("dark");
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  const rawValue = mockStorage.get("@theme_preference");
  expect(typeof rawValue).toBe("string");
  expect(rawValue).toBe("dark");
});
