import {
  defaultItems,
  defaultPreferences,
  defaultRules,
  defaultSessions,
} from "@quickstart/storage";
import type { StorageSnapshot } from "@quickstart/storage";

const STORAGE_KEY = "quickstart.snapshot.v1";

let memorySnapshot: StorageSnapshot | null = null;

export const loadSnapshot = (): StorageSnapshot => {
  if (memorySnapshot) {
    return memorySnapshot;
  }

  return {
    items: defaultItems,
    rules: defaultRules,
    sessions: defaultSessions,
    preferences: defaultPreferences,
  };
};

export const saveSnapshot = (snapshot: StorageSnapshot) => {
  memorySnapshot = snapshot;
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
