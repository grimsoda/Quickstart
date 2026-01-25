import type { MenuItem, Preference, Rule, Session } from "@quickstart/shared";

export type StorageSnapshot = {
  items: MenuItem[];
  rules: Rule[];
  sessions: Session[];
  preferences: Preference;
};

export type StorageAdapter = {
  getSnapshot: () => Promise<StorageSnapshot>;
  saveSnapshot: (snapshot: StorageSnapshot) => Promise<void>;
};
