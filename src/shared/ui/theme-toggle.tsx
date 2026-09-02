"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function getDocumentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeToTheme(callback: () => void) {
  window.addEventListener("themechange", callback);
  return () => window.removeEventListener("themechange", callback);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getDocumentTheme,
    () => "light",
  );

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event("themechange"));
  }

  const isDark = theme === "dark";

  return (
    <button
      aria-label={`Switch to ${isDark ? "day" : "night"} mode`}
      className="border-border bg-surface hover:bg-surface-muted grid size-10 shrink-0 cursor-pointer place-items-center border transition-colors"
      onClick={toggleTheme}
      title={`Switch to ${isDark ? "day" : "night"} mode`}
      type="button"
    >
      {isDark ? <Sun aria-hidden size={18} /> : <Moon aria-hidden size={18} />}
    </button>
  );
}
