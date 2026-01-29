import {
  defaultItems,
  defaultPreferences,
  defaultRules,
  defaultSessions,
} from "@quickstart/storage";
import type { StorageSnapshot } from "@quickstart/storage";

const STORAGE_KEY = "quickstart.snapshot.v1";
const CATEGORIES_KEY = "quickstart.categories.v1";

export const loadSnapshot = async (): Promise<StorageSnapshot> => {
  try {
    const AsyncStorage = await import("@react-native-async-storage/async-storage");
    const stored = await AsyncStorage.default.getItem(STORAGE_KEY);

    if (stored) {
      return JSON.parse(stored) as StorageSnapshot;
    }
  } catch (error) {
    console.error("Failed to load snapshot from AsyncStorage:", error);
  }

  return {
    items: defaultItems,
    rules: defaultRules,
    sessions: defaultSessions,
    preferences: defaultPreferences,
  };
};

export const saveSnapshot = async (snapshot: StorageSnapshot): Promise<void> => {
  try {
    const AsyncStorage = await import("@react-native-async-storage/async-storage");
    await AsyncStorage.default.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    console.error("Failed to save snapshot to AsyncStorage:", error);
  }
};

export const loadCategories = async (): Promise<string[]> => {
  try {
    const AsyncStorage = await import("@react-native-async-storage/async-storage");
    const stored = await AsyncStorage.default.getItem(CATEGORIES_KEY);

    if (stored) {
      return JSON.parse(stored) as string[];
    }
  } catch (error) {
    console.error("Failed to load categories from AsyncStorage:", error);
  }

  return [];
};

export const saveCategories = async (categories: string[]): Promise<void> => {
  try {
    const AsyncStorage = await import("@react-native-async-storage/async-storage");
    await AsyncStorage.default.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to save categories to AsyncStorage:", error);
  }
};

export type ThemeMode = "light" | "dark" | "system";

const THEME_PREFERENCE_KEY = "@theme_preference";

export const loadThemePreference = async (): Promise<ThemeMode | null> => {
  const AsyncStorage = await import("@react-native-async-storage/async-storage");
  const value = await AsyncStorage.default.getItem(THEME_PREFERENCE_KEY);
  return value as ThemeMode | null;
};

export const saveThemePreference = async (mode: ThemeMode): Promise<void> => {
  const AsyncStorage = await import("@react-native-async-storage/async-storage");
  await AsyncStorage.default.setItem(THEME_PREFERENCE_KEY, mode);
};

export const getEffectiveTheme = async (systemTheme?: "light" | "dark"): Promise<"light" | "dark"> => {
  const savedMode = await loadThemePreference();
  
  if (savedMode === null) {
    return systemTheme ?? "light";
  }
  
  if (savedMode === "system") {
    return systemTheme ?? "light";
  }
  
  return savedMode;
};
