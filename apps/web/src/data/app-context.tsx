import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { Mode, Preference, Session } from "@quickstart/shared";
import type { StorageSnapshot } from "@quickstart/storage";
import { loadSnapshot, saveSnapshot } from "./storage";
import { applySnapshot } from "./helpers";
import type { AppActions, AppState } from "./state";

const AppContext = createContext<(AppState & AppActions) | null>(null);

const AppProviderComponent = ({ children }: { children: ReactNode }) => {
  const [snapshot, setSnapshot] = useState<StorageSnapshot>(() => loadSnapshot());
  const [mode, setMode] = useState<Mode>("do");
  const [activeDecisionId, setActiveDecisionId] = useState<string | undefined>();

  const persist = (next: StorageSnapshot) => {
    setSnapshot(next);
    saveSnapshot(next);
  };

  const actions: AppActions = useMemo(
    () => ({
      setMode,
      setActiveDecision: (id) => setActiveDecisionId(id),
      addItem: (item) => {
        persist({ ...snapshot, items: [item, ...snapshot.items] });
      },
      updateItem: (item) => {
        persist({
          ...snapshot,
          items: snapshot.items.map((existing: StorageSnapshot["items"][number]) =>
            existing.id === item.id ? item : existing,
          ),
        });
      },
      deleteItem: (id) => {
        persist({
          ...snapshot,
          items: snapshot.items.filter(
            (item: StorageSnapshot["items"][number]) => item.id !== id,
          ),
        });
      },
      addSession: (session: Session) => {
        persist({ ...snapshot, sessions: [session, ...snapshot.sessions] });
      },
      updatePreferences: (preferences: Preference) => {
        persist({ ...snapshot, preferences });
      },
      replaceSnapshot: (next) => {
        applySnapshot(snapshot, next, persist);
      },
    }),
    [snapshot],
  );

  const value = useMemo(
    () => ({
      ...snapshot,
      mode,
      activeDecisionId,
      ...actions,
    }),
    [actions, activeDecisionId, mode, snapshot],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export const AppProvider = AppProviderComponent;
