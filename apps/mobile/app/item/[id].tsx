import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import type { MenuItem, Mode } from "@quickstart/shared";
import { useAppContext } from "../../data/app-context";
import { useThemeContext } from "../../data/theme-context";
import { Picker } from "@react-native-picker/picker";

const durationBuckets: MenuItem["durationBucket"][] = ["2m", "10m", "25m"];
const modes: Mode[] = ["do", "decide", "drift"];

const cycleValue = <T,>(values: T[], current: T) => {
  const index = values.indexOf(current);
  return values[(index + 1) % values.length] ?? values[0];
};

const ItemDetailContent = () => {
  const { theme } = useThemeContext();
  const { items, updateItem, deleteItem } = useAppContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const item = items.find((i: MenuItem) => i.id === id);
  const [localItem, setLocalItem] = useState<MenuItem | null>(item || null);

  const handleSave = () => {
    if (localItem) {
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
        picker: {
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 8,
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Item</Text>
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
          <View style={styles.row}>
            <Picker
              selectedValue={localItem?.durationBucket}
              onValueChange={(value) =>
                setLocalItem((prev) =>
                  prev
                    ? {
                        ...prev,
                        durationBucket: value as MenuItem["durationBucket"],
                      }
                    : null
                )
              }
              style={styles.picker}
            >
              <Picker.Item label="2 minutes" value="2m" />
              <Picker.Item label="10 minutes" value="10m" />
              <Picker.Item label="25 minutes" value="25m" />
            </Picker>
          </View>
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
          <View style={styles.row}>
            <Picker
              selectedValue={localItem?.mode}
              onValueChange={(value) =>
                setLocalItem((prev) =>
                  prev
                    ? { ...prev, mode: value as Mode }
                    : null
                )
              }
              style={styles.picker}
            >
              <Picker.Item label="Do" value="do" />
              <Picker.Item label="Decide" value="decide" />
              <Picker.Item label="Drift" value="drift" />
            </Picker>
          </View>
        </View>

        <View>
          <Text style={styles.label}>Tags</Text>
          <TextInput
            value={localItem?.tags.join(", ") || ""}
            placeholder="Tags (comma-separated)"
            placeholderTextColor={theme.colors.text}
            onChangeText={(text) =>
              setLocalItem((prev) =>
                prev
                  ? {
                      ...prev,
                      tags: text.split(",").map((tag) => tag.trim()).filter(Boolean),
                    }
                  : null
              )
            }
            style={styles.input}
          />
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
  );
};

export default function ItemDetailScreen() {
  return <ItemDetailContent />;
}
