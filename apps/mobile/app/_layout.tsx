import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "../data/app-context";
import { ThemeProvider, useThemeContext } from "../data/theme-context";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootLayoutContent() {
  const { theme } = useThemeContext();
  const isDark = theme.dark;

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="editor" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <RootLayoutContent />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
