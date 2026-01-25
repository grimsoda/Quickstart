import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { AppProvider, useAppContext } from "../data/app-context";

const SettingsContent = () => {
  const { preferences } = useAppContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.sectionTitle}>Widget defaults</Text>
      <Text style={styles.helperText}>Small widget: {preferences.widgetConfig.smallWidgetMode}</Text>
      <Text style={styles.helperText}>
        Medium widget: {preferences.widgetConfig.mediumWidgetModes.join(", ")}
      </Text>
      <Text style={styles.sectionTitle}>Export / Import</Text>
      <Text style={styles.helperText}>Export/import is available on web for now.</Text>
      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Open web editor</Text>
      </Pressable>
    </ScrollView>
  );
};

export default function SettingsScreen() {
  return (
    <AppProvider>
      <SettingsContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  helperText: {
    color: "#6b7280",
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: "#111827",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
