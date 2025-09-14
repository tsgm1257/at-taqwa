"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug logging
  useEffect(() => {
    if (mounted) {
      console.log("Current theme:", theme);
      console.log("Resolved theme:", resolvedTheme);
      console.log("Document classes:", document.documentElement.className);
    }
  }, [theme, resolvedTheme, mounted]);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-white/70 p-2">
        <div className="h-4 w-4"></div>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    const newTheme = isDark ? "light" : "dark";
    console.log("Theme toggle clicked, switching to:", newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-900/30 p-2 hover:bg-emerald-50 dark:hover:bg-emerald-800/40 transition-colors"
      onClick={handleToggle}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Moon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      )}
    </button>
  );
}
