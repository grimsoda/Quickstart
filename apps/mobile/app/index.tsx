import { Pressable, ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { useEffect } from "react";
import type { MenuItem, Mode } from "@quickstart/shared";
import { selectMenuItems } from "@quickstart/storage";
import { AppProvider, useAppContext } from "../data/app-context";
import { updateQuickstartWidget } from "../widgets/widget-updates";

console.log("[Quickstart App] File loaded - initialization starting");
console.log("[Quickstart App] Platform:", Platform.OS);
console.log("[Quickstart App] Environment:", __DEV__ ? "development" : "production");

const ModeHeader = ({ mode, onSelect }: { mode: Mode; onSelect: (mode: Mode) => void }) => {
  const modes: Mode[] = ["do", "decide", "drift"];
  return (
    <View style={styles.modeRow}>
      {modes.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(option)}
          style={[styles.modeChip, mode === option && styles.modeChipActive]}
        >
          <Text style={[styles.modeChipText, mode === option && styles.modeChipTextActive]}>
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const MenuList = ({ items, onStart }: { items: MenuItem[]; onStart: (item: MenuItem) => void }) => {
  return (
    <View style={styles.cardStack}>
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.startStep}</Text>
          <View style={styles.cardRow}>
            <Text style={styles.badge}>{item.durationBucket}</Text>
            <Pressable onPress={() => onStart(item)} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Start</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
};

const HomeContent = () => {
  const { mode, setMode, items, preferences, addSession } = useAppContext();
  const selection = selectMenuItems(items, mode, preferences);

  console.log("[Quickstart App] HomeContent rendered");
  console.log("[Quickstart App] Current mode:", mode);
  console.log("[Quickstart App] Items count:", items.length);
  console.log("[Quickstart App] Selection count:", selection.length);

  useEffect(() => {
    console.log("[Quickstart App] Widget update triggered with items:", JSON.stringify(items.map(i => ({ id: i.id, title: i.title }))));
    try {
      updateQuickstartWidget(items);
      console.log("[Quickstart App] Widget update completed successfully");
    } catch (error) {
      console.error("[Quickstart App] Widget update FAILED:", error);
      console.error("[Quickstart App] Error details:", JSON.stringify(error, null, 2));
      console.error("[Quickstart App] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    }
  }, [items]);

  const handleStart = (item: MenuItem) => {
    addSession({
      id: `session-${Date.now()}`,
      itemId: item.id,
      startedAt: new Date().toISOString(),
      endedAt: null,
      device: "mobile",
      outcome: "partial",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quickstart</Text>
      <Text style={styles.subtitle}>Do · Decide · Drift</Text>
      <ModeHeader mode={mode} onSelect={setMode} />
      <Text style={styles.sectionTitle}>Menu</Text>
      {selection.length === 0 ? (
        <Text style={styles.emptyState}>Add items from the web editor to get started.</Text>
      ) : (
        <MenuList items={selection} onStart={handleStart} />
      )}
    </ScrollView>
  );
};

export default function HomeScreen() {
  console.log("[Quickstart App] HomeScreen rendering - app launch starting");
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: "#6b7280",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptyState: {
    color: "#6b7280",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
  },
  modeChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  modeChipActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  modeChipText: {
    color: "#111827",
  },
  modeChipTextActive: {
    color: "#ffffff",
  },
  cardStack: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#6b7280",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
  },
  primaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#111827",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
