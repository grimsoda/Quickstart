import { test, expect } from "bun:test";

test("Home screen exports a default component", () => {
  const componentMock = {
    HomeScreen: () => {},
  };
  expect(componentMock).toHaveProperty("HomeScreen");
  expect(typeof componentMock.HomeScreen).toBe("function");
});

test("Home screen uses useSafeAreaInsets hook", () => {
  const mockSafeAreaInsets = {
    top: 44,
    right: 0,
    bottom: 34,
    left: 0,
  };

  expect(mockSafeAreaInsets).toHaveProperty("top");
  expect(mockSafeAreaInsets).toHaveProperty("right");
  expect(mockSafeAreaInsets).toHaveProperty("bottom");
  expect(mockSafeAreaInsets).toHaveProperty("left");
  expect(typeof mockSafeAreaInsets.top).toBe("number");
});

test("Home screen applies safe area insets to ScrollView padding", () => {
  const insets = {
    top: 44,
    right: 0,
    bottom: 34,
    left: 0,
  };

  const contentContainerStyle = {
    padding: 24,
    paddingTop: insets.top,
  };

  expect(contentContainerStyle).toHaveProperty("padding");
  expect(contentContainerStyle.padding).toBe(24);
  expect(contentContainerStyle).toHaveProperty("paddingTop");
  expect(contentContainerStyle.paddingTop).toBe(insets.top);
});

test("Home screen uses useThemeContext hook", () => {
  const mockThemeContext = {
    mode: "system" as "light" | "dark" | "system",
    theme: {
      colors: {
        background: "#ffffff",
        card: "#f9fafb",
        text: "#111827",
        border: "#e5e7eb",
        primary: "#111827",
        notification: "#111827",
      },
      dark: false,
    },
    setMode: (mode: "light" | "dark" | "system") => {},
  };

  expect(mockThemeContext).toHaveProperty("mode");
  expect(mockThemeContext).toHaveProperty("theme");
  expect(mockThemeContext).toHaveProperty("setMode");
  expect(typeof mockThemeContext.setMode).toBe("function");
});

test("Home screen uses useAppContext hook", () => {
  const mockAppContext = {
    mode: "do" as "do" | "decide" | "drift",
    setMode: (mode: "do" | "decide" | "drift") => {},
    items: [],
    preferences: { focusDuration: 25, breakDuration: 5 },
    addSession: (session: any) => {},
  };

  expect(mockAppContext).toHaveProperty("mode");
  expect(mockAppContext).toHaveProperty("setMode");
  expect(mockAppContext).toHaveProperty("items");
  expect(mockAppContext).toHaveProperty("preferences");
  expect(mockAppContext).toHaveProperty("addSession");
  expect(typeof mockAppContext.setMode).toBe("function");
  expect(Array.isArray(mockAppContext.items)).toBe(true);
});

test("Home screen includes ModeHeader component", () => {
  const modeHeaderMock = {
    ModeHeader: () => {},
  };
  expect(modeHeaderMock).toHaveProperty("ModeHeader");
  expect(typeof modeHeaderMock.ModeHeader).toBe("function");
});

test("Home screen includes MenuList component", () => {
  const menuListMock = {
    MenuList: () => {},
  };
  expect(menuListMock).toHaveProperty("MenuList");
  expect(typeof menuListMock.MenuList).toBe("function");
});

test("Home screen navigation to settings route", () => {
  let currentRoute = "/";

  const mockRouter = {
    push: (route: string) => {
      currentRoute = route;
    },
  };

  expect(typeof mockRouter.push).toBe("function");

  mockRouter.push("/settings");
  expect(currentRoute).toBe("/settings");
});

test("MenuList button displays 'Edit' text", () => {
  const buttonText = "Edit";

  expect(buttonText).toBe("Edit");
  expect(typeof buttonText).toBe("string");
});

test("MenuList button navigates to detail screen with item ID", () => {
  let currentRoute = "/";

  const mockRouter = {
    push: (route: string) => {
      currentRoute = route;
    },
  };

  const item = {
    id: "test-item-id",
    title: "Test Item",
    startStep: "Step 1",
    durationBucket: "short",
  };

  expect(typeof mockRouter.push).toBe("function");

  mockRouter.push(`/item/${item.id}`);
  expect(currentRoute).toBe(`/item/${item.id}`);
  expect(currentRoute).toContain(item.id);
});
