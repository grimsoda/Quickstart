import type { MenuItem } from "@quickstart/shared";
import { ExtensionStorage } from "@bacons/apple-targets";
import { generateWidgetSnapshot } from "./widget-snapshot";

export { generateWidgetSnapshot } from "./widget-snapshot";

export const updateQuickstartWidget = (items: MenuItem[]) => {
  const storage = new ExtensionStorage("group.com.quickstart.app");
  
  const snapshot = generateWidgetSnapshot(items);
  
  storage.set("widgetSnapshot", JSON.stringify(snapshot));
};
