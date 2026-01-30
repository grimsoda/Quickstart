import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import type { MenuItem, Mode } from "@quickstart/shared";
import { useAppContext } from "../../data/app-context";
import { useThemeContext } from "../../data/theme-context";

const durationBuckets: MenuItem["durationBucket"][] = ["2m", "10m", "25m"];
const modes: Mode[] = ["do", "decide", "drift"];

const cycleValue = <T,>(values: T[], current: T) => {
  const index = values.indexOf(current);
  return values[(index + 1) % values.length] ?? values[0];
};

const ItemDetailContent = () => {
  const { theme } = useThemeContext();
  const { items, updateItem, deleteItem, categories } = useAppContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const item = items.find((i: MenuItem) => i.id === id);
  const isNewItem = !item;
  const [localItem, setLocalItem] = useState<MenuItem | null>(item || null);

  // Set default values for duration and mode if not set
  useEffect(() => {
    setLocalItem((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        durationBucket: prev.durationBucket ?? durationBuckets[0],
        mode: prev.mode ?? modes[0],
      };
    });
  }, []);

  const handleSave = () => {
    if (localItem) {
      if (!localItem.title || localItem.title.trim() === "") {
        Alert.alert("Error", "Title is required");
        return;
      }
      updateItem(localItem);
      router.back();
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleDelete = () => {
    if (localItem) {
      Alert.alert(
        "Delete Item",
        "Are you sure you want to delete this item?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteItem(localItem.id);
              router.back();
            },
          },
        ]
      );
    }
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
        card: {
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card,
          padding: 16,
          gap: 16,
        },
        label: {
          fontSize: 14,
          fontWeight: "600",
          color: theme.colors.text,
          marginBottom: 4,
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
        buttonRow: {
          flexDirection: "row",
          gap: 12,
          marginTop: 8,
        },
        saveButton: {
          flex: 1,
          backgroundColor: theme.colors.text,
          paddingVertical: 10,
          borderRadius: 12,
          alignItems: "center",
        },
        saveButtonText: {
          color: theme.colors.background,
          fontWeight: "600",
        },
        cancelButton: {
          flex: 1,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingVertical: 10,
          borderRadius: 12,
          alignItems: "center",
        },
        cancelButtonText: {
          color: theme.colors.text,
          fontWeight: "600",
        },
        deleteButton: {
          flex: 1,
          borderWidth: 1,
          borderColor: "#ef4444",
          paddingVertical: 10,
          borderRadius: 12,
          alignItems: "center",
        },
        deleteButtonText: {
          color: "#ef4444",
          fontWeight: "600",
        },
      }),
    [theme, insets],
  );

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Item not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={64}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{isNewItem ? "Add Item" : "Edit Item"}</Text>
      <View style={styles.card}>
        <View>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={localItem?.title || ""}
            placeholder="Title"
            placeholderTextColor={theme.colors.text}
            onChangeText={(text) =>
              setLocalItem((prev) => (prev ? { ...prev, title: text } : null))
            }
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={localItem?.startStep || ""}
            placeholder="Description"
            placeholderTextColor={theme.colors.text}
            onChangeText={(text) =>
              setLocalItem((prev) => (prev ? { ...prev, startStep: text } : null))
            }
            style={styles.input}
            multiline
          />
        </View>

        <View>
          <Text style={styles.label}>Duration</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.row}>
              {durationBuckets.map((bucket) => {
                const isSelected = localItem?.durationBucket === bucket;
                const displayLabel = bucket === "2m" ? "2 min" : bucket === "10m" ? "10 min" : "25 min";
                return (
                  <Pressable
                    key={bucket}
                    onPress={() =>
                      setLocalItem((prev) =>
                        prev
                          ? { ...prev, durationBucket: bucket }
                          : null
                      )
                    }
                    style={[
                      styles.chip,
                      isSelected && {
                        backgroundColor: theme.colors.text,
                        borderColor: theme.colors.text,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && { color: theme.colors.background },
                      ]}
                    >
                      {displayLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View>
          <Text style={styles.label}>Category</Text>
          <TextInput
            value={localItem?.category || ""}
            placeholder="Category"
            placeholderTextColor={theme.colors.text}
            onChangeText={(text) =>
              setLocalItem((prev) =>
                prev ? { ...prev, category: text as MenuItem["category"] } : null
              )
            }
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Mode</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.row}>
              {modes.map((mode) => {
                const isSelected = localItem?.mode === mode;
                const displayLabel = mode.charAt(0).toUpperCase() + mode.slice(1);
                return (
                  <Pressable
                    key={mode}
                    onPress={() =>
                      setLocalItem((prev) =>
                        prev
                          ? { ...prev, mode: mode }
                          : null
                      )
                    }
                    style={[
                      styles.chip,
                      isSelected && {
                        backgroundColor: theme.colors.text,
                        borderColor: theme.colors.text,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && { color: theme.colors.background },
                      ]}
                    >
                      {displayLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View>
          <Text style={styles.label}>Tags</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.row}>
              {categories.map((category) => {
                const isSelected = localItem?.tags.includes(category) ?? false;
                return (
                  <Pressable
                    key={category}
                    onPress={() =>
                      setLocalItem((prev) =>
                        prev
                          ? {
                              ...prev,
                              tags: isSelected
                                ? prev.tags.filter((t) => t !== category)
                                : [...prev.tags, category],
                            }
                          : null
                      )
                    }
                    style={[
                      styles.chip,
                      isSelected && {
                        backgroundColor: theme.colors.text,
                        borderColor: theme.colors.text,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && { color: theme.colors.background },
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View style={styles.buttonRow}>
          <Pressable onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
          <Pressable onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
          <Pressable onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default function ItemDetailScreen() {
  return <ItemDetailContent />;
}
