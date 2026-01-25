import {
  defaultItems,
  defaultPreferences,
  defaultRules,
  defaultSessions,
} from "@quickstart/storage";
import type { StorageSnapshot } from "@quickstart/storage";

const STORAGE_KEY = "quickstart.snapshot.v1";

export const loadSnapshot = (): StorageSnapshot => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      items: defaultItems,
      rules: defaultRules,
      sessions: defaultSessions,
      preferences: defaultPreferences,
    };
  }

  try {
    return JSON.parse(raw) as StorageSnapshot;
  } catch {
    return {
      items: defaultItems,
      rules: defaultRules,
      sessions: defaultSessions,
      preferences: defaultPreferences,
    };
  }
};

export const saveSnapshot = (snapshot: StorageSnapshot) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
};
