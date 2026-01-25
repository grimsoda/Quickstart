import type { MenuItem, Mode, Preference, Session } from "@quickstart/shared";
import type { StorageSnapshot } from "@quickstart/storage";

export type AppState = StorageSnapshot & {
  mode: Mode;
  activeDecisionId?: string;
};

export type AppActions = {
  setMode: (mode: Mode) => void;
  addItem: (item: MenuItem) => void;
  updateItem: (item: MenuItem) => void;
  deleteItem: (id: string) => void;
  addSession: (session: Session) => void;
  updatePreferences: (preferences: Preference) => void;
  setActiveDecision: (id?: string) => void;
  replaceSnapshot: (snapshot: StorageSnapshot) => void;
};
