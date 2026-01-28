import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { Mode, Preference, Session } from "@quickstart/shared";
import type { StorageSnapshot } from "@quickstart/storage";
import { loadSnapshot, saveSnapshot } from "./storage";

type AppState = StorageSnapshot & {
  mode: Mode;
  activeDecisionId?: string;
  categories: string[];
};

type AppActions = {
  setMode: (mode: Mode) => void;
  setActiveDecision: (id?: string) => void;
  addItem: (item: StorageSnapshot["items"][number]) => void;
  updateItem: (item: StorageSnapshot["items"][number]) => void;
  deleteItem: (id: string) => void;
  addSession: (session: Session) => void;
  updatePreferences: (preferences: Preference) => void;
  replaceSnapshot: (snapshot: StorageSnapshot) => void;
  updateCategories: (categories: string[]) => void;
  deleteCategory: (categoryName: string) => void;
};

const AppContext = createContext<(AppState & AppActions) | null>(null);

const initialSnapshot = loadSnapshot();

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [snapshot, setSnapshot] = useState<StorageSnapshot>(initialSnapshot);
  const [mode, setMode] = useState<Mode>("do");
  const [activeDecisionId, setActiveDecisionId] = useState<string | undefined>();
  const [categories, setCategories] = useState<string[]>([]);

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
          items: snapshot.items.map((existing) =>
            existing.id === item.id ? item : existing,
          ),
        });
      },
      deleteItem: (id) => {
        persist({
          ...snapshot,
          items: snapshot.items.filter((item) => item.id !== id),
        });
      },
      addSession: (session: Session) => {
        persist({ ...snapshot, sessions: [session, ...snapshot.sessions] });
      },
      updatePreferences: (preferences: Preference) => {
        persist({ ...snapshot, preferences });
      },
      replaceSnapshot: (next) => {
        persist(next);
      },
      updateCategories: (newCategories: string[]) => {
        setCategories(newCategories);
      },
      deleteCategory: (categoryName: string) => {
        setCategories(categories.filter((cat) => cat !== categoryName));
        persist({
          ...snapshot,
          items: snapshot.items.map((item) =>
            item.category === categoryName ? { ...item, category: null } : item,
          ),
        });
      },
    }),
    [snapshot, categories],
  );

  const value = useMemo(
    () => ({
      ...snapshot,
      mode,
      activeDecisionId,
      categories,
      ...actions,
    }),
    [actions, activeDecisionId, categories, mode, snapshot],
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
