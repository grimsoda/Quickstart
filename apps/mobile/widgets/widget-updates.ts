import type { MenuItem } from "@quickstart/shared";
import { updateWidgetSnapshot } from "expo-widgets";
import { QuickstartWidget } from "./QuickstartWidget";

const pickTop = (items: MenuItem[], mode: MenuItem["mode"]) =>
  items.find((item) => item.mode === mode);

export const updateQuickstartWidget = (items: MenuItem[]) => {
  updateWidgetSnapshot(
    "QuickstartWidget",
    QuickstartWidget,
    {
      topDo: pickTop(items, "do"),
      topDecide: pickTop(items, "decide"),
      topDrift: pickTop(items, "drift"),
    },
  );
};
