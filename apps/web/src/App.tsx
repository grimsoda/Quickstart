import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { HomePage } from "./pages/home";
import { EditorPage } from "./pages/editor";
import { SettingsPage } from "./pages/settings";
import { AppProvider } from "./data/app-context";

const pages: Record<string, ComponentType> = {
  "/": HomePage,
  "/editor": EditorPage,
  "/settings": SettingsPage,
};

const resolvePage = () => {
  const path = window.location.pathname;
  return pages[path] ?? HomePage;
};

export const App = () => {
  const [Page, setPage] = useState<ComponentType>(() => resolvePage());

  useEffect(() => {
    const handlePop = () => setPage(resolvePage());
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  return (
    <AppProvider>
      <Page />
    </AppProvider>
  );
};
