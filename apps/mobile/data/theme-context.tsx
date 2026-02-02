import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
  type Theme,
} from "@react-navigation/native";
import { loadThemePreference, saveThemePreference } from "./storage";

type ThemeMode = "light" | "dark" | "system";

type ThemeState = {
  mode: ThemeMode;
  theme: Theme;
};

type ThemeActions = {
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<(ThemeState & ThemeActions) | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    const loadSavedTheme = async () => {
      const savedMode = await loadThemePreference();
      if (savedMode) {
        setModeState(savedMode);
      }
      setIsLoading(false);
    };

    loadSavedTheme();
  }, []);

  const setMode = useMemo(
    () => (newMode: ThemeMode) => {
      setModeState(newMode);
      saveThemePreference(newMode);
    },
    []
  );

  const theme = useMemo(() => {
    if (mode === "system") {
      return systemColorScheme === "dark"
        ? NavigationDarkTheme
        : NavigationDefaultTheme;
    }
    return mode === "dark" ? NavigationDarkTheme : NavigationDefaultTheme;
  }, [mode, systemColorScheme]);

  const value = useMemo(
    () => ({
      mode,
      theme,
      setMode,
    }),
    [mode, theme, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
};
