import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAppContext } from "../data/app-context";
import { useThemeContext } from "../data/theme-context";

type ThemeMode = "light" | "dark" | "system";

type SettingsSection = {
  title: string;
  data: any[];
};

type OrderingPreference = "duration" | "recent";

const CategoryList = ({ items, categories, styles, theme, updateCategories, deleteCategory }: { items: any[]; categories: string[]; styles: ReturnType<typeof StyleSheet.create>; theme: any; updateCategories: (categories: string[]) => void; deleteCategory: (categoryName: string) => void }) => {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      updateCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleEditCategory = (categoryName: string) => {
    setEditingCategory(categoryName);
    setEditValue(categoryName);
    // Focus input after render
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSaveEdit = () => {
    if (editingCategory && editValue.trim()) {
      const index = categories.indexOf(editingCategory);
      if (index !== -1) {
        const updatedCategories = [...categories];
        updatedCategories[index] = editValue.trim();
        updateCategories(updatedCategories);
      }
    }
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryName: string) => {
    Alert.alert(
      "Delete Category",
      `Delete "${categoryName}"? Items with this category will be unassigned.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteCategory(categoryName);
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View>
        <View style={styles.categoryInputRow}>
        <TextInput
          style={styles.categoryInput}
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder="Add new category"
          placeholderTextColor={theme.colors.text}
        />
        <Pressable style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
      <View style={styles.categoryList}>
        {categories.map((category) => (
          <View key={category} style={styles.categoryItem}>
            {editingCategory === category ? (
              <TextInput
                ref={inputRef}
                style={styles.editInput}
                value={editValue}
                onChangeText={setEditValue}
                onBlur={handleSaveEdit}
                onSubmitEditing={handleSaveEdit}
                autoFocus
              />
            ) : (
              <Text style={styles.categoryName}>{category}</Text>
            )}
            <View style={styles.categoryActions}>
              <Pressable
                style={styles.editButton}
                onPress={() => handleEditCategory(category)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDeleteCategory(category)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
        {categories.length === 0 && (
          <Text style={styles.emptyText}>No tags yet. Add one above.</Text>
        )}
      </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const SettingsContent = () => {
  const { mode, theme, setMode } = useThemeContext();
  const { preferences, updatePreferences, items, categories, updateCategories, deleteCategory, isLoading } = useAppContext();
  const insets = useSafeAreaInsets();

  const safePreferences = preferences || { ordering: "duration" };
  const safeCategories = categories || [];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 24,
          paddingTop: insets.top + 24,
        },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        },
        backButton: {
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card,
        },
        backButtonText: {
          fontSize: 18,
          color: theme.colors.text,
          fontWeight: "600",
        },
        title: {
          fontSize: 24,
          fontWeight: "700",
          color: theme.colors.text,
        },
        sectionHeader: {
          fontSize: 18,
          fontWeight: "600",
          color: theme.colors.text,
          marginBottom: 8,
        },
        picker: {
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 8,
        },
        sectionContent: {
          marginBottom: 24,
        },
        segmentedControl: {
          flexDirection: "row",
          backgroundColor: theme.colors.card,
          borderRadius: 12,
          padding: 4,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        segment: {
          flex: 1,
          paddingVertical: 12,
          alignItems: "center",
          borderRadius: 8,
        },
        segmentActive: {
          backgroundColor: theme.colors.text,
        },
        segmentText: {
          color: theme.colors.text,
          fontWeight: "500",
        },
        segmentTextActive: {
          color: theme.colors.background,
        },
        placeholder: {
          padding: 16,
          backgroundColor: theme.colors.card,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        placeholderText: {
          color: theme.colors.text,
          fontSize: 16,
        },
        categoryInputRow: {
          flexDirection: "row",
          gap: 8,
          marginBottom: 16,
        },
        categoryInput: {
          flex: 1,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 12,
          paddingVertical: 8,
          paddingHorizontal: 12,
          color: theme.colors.text,
        },
        addButton: {
          backgroundColor: theme.colors.text,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 12,
        },
        addButtonText: {
          color: theme.colors.background,
          fontWeight: "600",
        },
        categoryList: {
          gap: 12,
        },
        categoryItem: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme.colors.card,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: 12,
        },
        categoryName: {
          fontSize: 16,
          color: theme.colors.text,
        },
        categoryActions: {
          flexDirection: "row",
          gap: 8,
        },
        editButton: {
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 12,
        },
        editButtonText: {
          color: theme.colors.text,
          fontSize: 14,
        },
        deleteButton: {
          borderWidth: 1,
          borderColor: "#ef4444",
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 12,
        },
        deleteButtonText: {
          color: "#ef4444",
          fontSize: 14,
        },
        emptyText: {
          color: theme.colors.text,
          fontSize: 14,
          opacity: 0.6,
          textAlign: "center",
          padding: 16,
        },
        buttonRow: {
          flexDirection: "row",
          gap: 12,
        },
        exportButton: {
          flex: 1,
          backgroundColor: theme.colors.text,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
          alignItems: "center",
        },
        exportButtonText: {
          color: theme.colors.background,
          fontWeight: "600",
          fontSize: 16,
        },
        importButton: {
          flex: 1,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
          alignItems: "center",
        },
        importButtonText: {
          color: theme.colors.text,
          fontWeight: "600",
          fontSize: 16,
        },
        editInput: {
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 12,
          color: theme.colors.text,
          backgroundColor: theme.colors.card,
        },
      }),
    [theme, insets],
  );

  const handleExport = async () => {
    try {
      const jsonString = JSON.stringify({ items }, null, 2);
      const fileName = `quickstart-items-${Date.now()}.json`;
      const file = new File([jsonString], fileName, { type: "application/json" });
      const dataUrl = URL.createObjectURL(file);

      await Sharing.shareAsync(dataUrl, { mimeType: "application/json" });
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to export data");
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        const fileContent = await fetch(file.uri).then((res) => res.text());

        const parsed = JSON.parse(fileContent);

        if (!parsed.items || !Array.isArray(parsed.items)) {
          throw new Error("Invalid JSON: items must be an array");
        }

        if (parsed.preferences || parsed.sessions || parsed.rules) {
          throw new Error("Invalid JSON: only items allowed, no preferences/sessions/rules");
        }

        Alert.alert("Success", "Items imported successfully");
      }
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to import data");
    }
  };

  const themeModes: ThemeMode[] = ["light", "dark", "system"];
  const orderingOptions: OrderingPreference[] = ["duration", "recent"];

  const sections: SettingsSection[] = [
    {
      title: "APPEARANCE",
      data: ["theme-toggle"],
    },
    {
      title: "ORDERING",
      data: ["ordering"],
    },
    {
      title: "TAGS",
      data: ["categories-placeholder"],
    },
    {
      title: "IMPORT/EXPORT",
      data: ["import-export-placeholder"],
    },
  ];

  const renderItem = ({ item, section }: { item: string; section: SettingsSection }) => {
    if (section.title === "APPEARANCE" && item === "theme-toggle") {
      return (
        <View style={styles.sectionContent}>
          <View style={styles.segmentedControl}>
            {themeModes.map((themeMode) => (
              <Pressable
                key={themeMode}
                style={[
                  styles.segment,
                  mode === themeMode ? styles.segmentActive : null,
                ]}
                onPress={() => setMode(themeMode)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    mode === themeMode ? styles.segmentTextActive : null,
                  ]}
                >
                  {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }

    if (section.title === "ORDERING" && item === "ordering") {
      return (
        <View style={styles.sectionContent}>
          <View style={styles.segmentedControl}>
            {orderingOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.segment,
                  safePreferences.ordering === option ? styles.segmentActive : null,
                ]}
                onPress={() => updatePreferences({ ...safePreferences, ordering: option })}
              >
                <Text
                  style={[
                    styles.segmentText,
                    safePreferences.ordering === option ? styles.segmentTextActive : null,
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }

    if (section.title === "TAGS" && item === "categories-placeholder") {
      return (
        <View style={styles.sectionContent}>
          <CategoryList items={items} categories={safeCategories} styles={styles} theme={theme} updateCategories={updateCategories} deleteCategory={deleteCategory} />
        </View>
      );
    }

    if (section.title === "IMPORT/EXPORT" && item === "import-export-placeholder") {
      return (
        <View style={styles.sectionContent}>
          <View style={styles.buttonRow}>
            <Pressable onPress={handleExport} style={styles.exportButton}>
              <Text style={styles.exportButtonText}>Export</Text>
            </Pressable>
            <Pressable onPress={handleImport} style={styles.importButton}>
              <Text style={styles.importButtonText}>Import</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.sectionContent}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {item.replace("-", " ").toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        {sections.map((section) => (
          <View key={section.title}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            {section.data.map((item: any) => (
              renderItem({ item, section })
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default function SettingsScreen() {
  return <SettingsContent />;
}
