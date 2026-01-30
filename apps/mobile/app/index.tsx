import { Pressable, ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { useEffect, useMemo } from "react";
import { useRouter } from "expo-router";
import type { MenuItem, Mode } from "@quickstart/shared";
import { selectMenuItems } from "@quickstart/storage";
import { useAppContext } from "../data/app-context";
import { useThemeContext } from "../data/theme-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { updateQuickstartWidget } from "../widgets/widget-updates";

console.log("[Quickstart App] File loaded - initialization starting");
console.log("[Quickstart App] Platform:", Platform.OS);
console.log("[Quickstart App] Environment:", __DEV__ ? "development" : "production");

const ModeHeader = ({ mode, onSelect, styles }: { mode: Mode; onSelect: (mode: Mode) => void; styles: ReturnType<typeof StyleSheet.create> }) => {
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

const MenuList = ({ items, router, styles }: { items: MenuItem[]; router: ReturnType<typeof useRouter>; styles: ReturnType<typeof StyleSheet.create> }) => {
  return (
    <View style={styles.cardStack}>
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.startStep}</Text>
          <View style={styles.cardRow}>
            <Text style={styles.badge}>{item.durationBucket}</Text>
            <Pressable onPress={() => router.push(`/item/${item.id}`)} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Edit</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
};

const HomeContent = () => {
  const { theme } = useThemeContext();
  const { mode, setMode, items, preferences, addSession, addItem } = useAppContext();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const selection = selectMenuItems(items, mode, preferences);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: 24,
          backgroundColor: theme.colors.background,
          flex: 1,
        },
        header: {
          paddingTop: insets.top,
          gap: 16,
        },
        title: {
          fontSize: 28,
          fontWeight: "700",
          color: theme.colors.text,
        },
        subtitle: {
          color: theme.colors.text,
          opacity: 0.7,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "600",
          color: theme.colors.text,
        },
        emptyState: {
          color: theme.colors.text,
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        modeRow: {
          flexDirection: "row",
          gap: 8,
        },
        modeChip: {
          borderRadius: 999,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingVertical: 6,
          paddingHorizontal: 12,
        },
        modeChipActive: {
          backgroundColor: theme.colors.text,
          borderColor: theme.colors.text,
        },
        modeChipText: {
          color: theme.colors.text,
        },
        modeChipTextActive: {
          color: theme.colors.background,
        },
        settingsButton: {
          padding: 8,
        },
        settingsText: {
          color: theme.colors.text,
          fontSize: 14,
          fontWeight: "600",
        },
        cardStack: {
          gap: 12,
        },
        card: {
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card,
          padding: 16,
          gap: 8,
        },
        cardTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: theme.colors.text,
        },
        cardSubtitle: {
          color: theme.colors.text,
          opacity: 0.7,
        },
        cardRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        badge: {
          backgroundColor: theme.colors.border,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 999,
          fontSize: 12,
          color: theme.colors.text,
        },
        primaryButton: {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: theme.colors.text,
        },
        primaryButtonText: {
          color: theme.colors.background,
          fontWeight: "600",
        },
      }),
    [theme, insets],
  );

  const handleAddItem = () => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      mode: "do" as Mode,
      title: "",
      startStep: "",
      durationBucket: "2m" as MenuItem["durationBucket"],
      category: null,
      tags: [],
      frictionScore: 1,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addItem(newItem);
    router.push(`/item/${newItem.id}`);
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quickstart</Text>
        <Text style={styles.subtitle}>Do · Decide · Drift</Text>
        <View style={styles.headerRow}>
          <ModeHeader mode={mode} onSelect={setMode} styles={styles} />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable onPress={handleAddItem} style={styles.settingsButton}>
              <Text style={styles.settingsText}>+ Add</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/settings")} style={styles.settingsButton}>
              <Text style={styles.settingsText}>Settings</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <ScrollView>
        <Text style={styles.sectionTitle}>Menu</Text>
        {selection.length === 0 ? (
          <Text style={styles.emptyState}>Add items from the web editor to get started.</Text>
        ) : (
          <MenuList items={selection} router={router} styles={styles} />
        )}
      </ScrollView>
    </View>
  );
};

export default function HomeScreen() {
  console.log("[Quickstart App] HomeScreen rendering - app launch starting");
  return <HomeContent />;
}
