import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Mode, Preference, Session } from "@quickstart/shared";
import type { StorageSnapshot } from "@quickstart/storage";
import {
  defaultItems,
  defaultPreferences,
  defaultRules,
  defaultSessions,
} from "@quickstart/storage";
import { loadCategories, loadSnapshot, saveCategories, saveSnapshot } from "./storage";

type AppState = StorageSnapshot & {
  mode: Mode;
  activeDecisionId?: string;
  categories: string[];
  isLoading: boolean;
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

const defaultSnapshot: StorageSnapshot = {
  items: defaultItems,
  rules: defaultRules,
  sessions: defaultSessions,
  preferences: defaultPreferences,
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [snapshot, setSnapshot] = useState<StorageSnapshot>(defaultSnapshot);
  const [mode, setMode] = useState<Mode>("do");
  const [activeDecisionId, setActiveDecisionId] = useState<string | undefined>();
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      const [loadedSnapshot, loadedCategories] = await Promise.all([
        loadSnapshot(),
        loadCategories(),
      ]);
      setSnapshot(loadedSnapshot);
      setCategories(loadedCategories);
      setIsLoading(false);
    };

    loadInitialData();
  }, []);

  const persist = async (next: StorageSnapshot) => {
    setSnapshot(next);
    await saveSnapshot(next);
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
        saveCategories(newCategories);
      },
      deleteCategory: (categoryName: string) => {
        const newCategories = categories.filter((cat) => cat !== categoryName);
        setCategories(newCategories);
        saveCategories(newCategories);
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
      isLoading,
      ...actions,
    }),
    [actions, activeDecisionId, categories, isLoading, mode, snapshot],
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
