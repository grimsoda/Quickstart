import type { MenuItem } from "@quickstart/shared";

const pickTop = (items: MenuItem[], mode: MenuItem["mode"]) =>
  items.find((item) => item.mode === mode);

export const generateWidgetSnapshot = (items: MenuItem[]) => ({
  topDo: pickTop(items, "do"),
  topDecide: pickTop(items, "decide"),
  topDrift: pickTop(items, "drift"),
});
