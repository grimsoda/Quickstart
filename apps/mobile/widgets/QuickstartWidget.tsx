import { HStack, Text, VStack } from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import type { MenuItem } from "@quickstart/shared";
import type { WidgetBase } from "expo-widgets";

type WidgetProps = WidgetBase<{
  topDo?: MenuItem;
  topDecide?: MenuItem;
  topDrift?: MenuItem;
}>;

const ItemLine = ({ label, title }: { label: string; title?: string }) => {
  return (
    <HStack spacing={6}>
      <Text>{label}</Text>
      <Text modifiers={[foregroundStyle("#6b7280")]}> 
        {title ?? "Add item"}
      </Text>
    </HStack>
  );
};

export const QuickstartWidget = ({ family, topDo, topDecide, topDrift }: WidgetProps) => {
  if (family === "systemSmall") {
    return (
      <VStack spacing={8}>
        <Text>Quickstart</Text>
        <ItemLine label="Do" title={topDo?.title} />
        <ItemLine label="Tomorrow" title={topDecide?.title} />
      </VStack>
    );
  }

  return (
    <VStack spacing={8}>
      <Text>Quickstart</Text>
      <ItemLine label="Do" title={topDo?.title} />
      <ItemLine label="Decide" title={topDecide?.title} />
      <ItemLine label="Drift" title={topDrift?.title} />
    </VStack>
  );
};
