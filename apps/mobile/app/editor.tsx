import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MenuCategory, MenuItem, Mode } from "@quickstart/shared";
import { useAppContext } from "../data/app-context";
import { useThemeContext } from "../data/theme-context";

const categories: MenuCategory[] = ["career", "tomorrow", "drift"];
const modes: Mode[] = ["do", "decide", "drift"];
const buckets: MenuItem["durationBucket"][] = ["2m", "10m", "25m"];

const EditorContent = () => {
  const { theme } = useThemeContext();
  const { items, addItem, updateItem, deleteItem } = useAppContext();
  const insets = useSafeAreaInsets();

  const handleAdd = () => {
    const now = new Date().toISOString();
    const nextItem: MenuItem = {
      id: `item-${Date.now()}`,
      mode: "do",
      title: "",
      startStep: "",
      durationBucket: "2m",
      category: "career",
      tags: [],
      frictionScore: 1,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    };

    addItem(nextItem);
  };

  const cycleValue = <T,>(values: T[], current: T) => {
    const index = values.indexOf(current);
    return values[(index + 1) % values.length] ?? values[0];
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: 24,
          paddingTop: insets.top + 24,
          gap: 16,
          backgroundColor: theme.colors.background,
        },
        title: {
          fontSize: 24,
          fontWeight: "700",
          color: theme.colors.text,
        },
        primaryButton: {
          backgroundColor: theme.colors.text,
          paddingVertical: 10,
          borderRadius: 12,
          alignItems: "center",
        },
        primaryButtonText: {
          color: theme.colors.background,
          fontWeight: "600",
        },
        card: {
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card,
          padding: 16,
          gap: 8,
        },
        input: {
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 10,
          paddingVertical: 8,
          paddingHorizontal: 12,
          color: theme.colors.text,
        },
        row: {
          flexDirection: "row",
          gap: 8,
          flexWrap: "wrap",
        },
        chip: {
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 999,
          paddingVertical: 6,
          paddingHorizontal: 12,
        },
        chipText: {
          color: theme.colors.text,
          fontSize: 12,
        },
        deleteButton: {
          borderWidth: 1,
          borderColor: "#ef4444",
          borderRadius: 999,
          paddingVertical: 6,
          paddingHorizontal: 12,
        },
        deleteText: {
          color: "#ef4444",
          fontSize: 12,
        },
      }),
    [theme, insets],
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Item editor</Text>
      <Pressable style={styles.primaryButton} onPress={handleAdd}>
        <Text style={styles.primaryButtonText}>Add item</Text>
      </Pressable>
      {items.map((item: MenuItem) => (
        <View key={item.id} style={styles.card}>
          <TextInput
            value={item.title}
            placeholder="Title"
            placeholderTextColor={theme.colors.text}
            onChangeText={(text) =>
              updateItem({ ...item, title: text, updatedAt: new Date().toISOString() })
            }
            style={styles.input}
          />
          <TextInput
            value={item.startStep}
            placeholder="Start step"
            placeholderTextColor={theme.colors.text}
            onChangeText={(text) =>
              updateItem({ ...item, startStep: text, updatedAt: new Date().toISOString() })
            }
            style={styles.input}
          />
          <View style={styles.row}>
            <Pressable
              style={styles.chip}
              onPress={() =>
                updateItem({
                  ...item,
                  mode: cycleValue(modes, item.mode) as Mode,
                  updatedAt: new Date().toISOString(),
                })
              }
            >
              <Text style={styles.chipText}>Mode: {item.mode}</Text>
            </Pressable>
            <Pressable
              style={styles.chip}
              onPress={() =>
                updateItem({
                  ...item,
                  category: cycleValue(categories, item.category) as MenuCategory,
                  updatedAt: new Date().toISOString(),
                })
              }
            >
              <Text style={styles.chipText}>Category: {item.category}</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              style={styles.chip}
              onPress={() =>
                updateItem({
                  ...item,
                  durationBucket: cycleValue(buckets, item.durationBucket) as MenuItem["durationBucket"],
                  updatedAt: new Date().toISOString(),
                })
              }
            >
              <Text style={styles.chipText}>Duration: {item.durationBucket}</Text>
            </Pressable>
            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteItem(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default function EditorScreen() {
  return <EditorContent />;
}
