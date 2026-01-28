import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
  type Theme,
} from "@react-navigation/native";

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
  const [mode, setMode] = useState<ThemeMode>("system");
  const systemColorScheme = useColorScheme();

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
    [mode, theme],
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
