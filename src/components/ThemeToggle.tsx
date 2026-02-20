"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onToggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={isDark}
      className="
        relative inline-flex h-6 w-11 items-center rounded-full
        bg-gray-200 dark:bg-gray-700
        transition-colors
        focus:outline-none focus:ring-2 focus:ring-primary
        focus:ring-offset-2 dark:focus:ring-offset-gray-900
      "
    >
      <span className="sr-only">Toggle dark mode</span>

      {/* THUMB */}
      <span
        className={`
          inline-flex h-6 w-6 items-center justify-center
          rounded-full bg-white shadow
          transition-transform duration-200 ease-in-out
          ${isDark ? "translate-x-5" : "translate-x-1"}
        `}
      >
        <span
          className={`
            material-icons-outlined
            text-[10px] leading-none
            ${isDark ? "text-primary" : "text-gray-400"}
          `}
        >
          {isDark ? "dark_mode" : "light_mode"}
        </span>
      </span>
    </button>
  );
}