import { useState, useEffect } from "react";
import { isAuthenticated } from "@/lib/storage";
import { applyTheme } from "@/lib/theme";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import SettingsPage from "@/pages/SettingsPage";

type View = "dashboard" | "settings";

const Index = () => {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [view, setView] = useState<View>("dashboard");

  useEffect(() => {
    applyTheme();
  }, []);

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />;
  }

  if (view === "settings") {
    return <SettingsPage onBack={() => setView("dashboard")} />;
  }

  return (
    <DashboardPage
      onLogout={() => setAuthed(false)}
      onOpenSettings={() => setView("settings")}
    />
  );
};

export default Index;
