import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "../data/app-context";
import { ThemeProvider } from "../data/theme-context";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="editor" />
            <Stack.Screen name="settings" />
          </Stack>
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
