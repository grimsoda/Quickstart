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
