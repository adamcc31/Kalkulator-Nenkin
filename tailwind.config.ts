import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF4D00",
        "background-light": "#F8FAFC",
        "background-dark": "#0B1120",
        "surface-dark": "#151E32",
        "surface-light": "#FFFFFF",
        "text-main-dark": "#F1F5F9",
        "text-main-light": "#0F172A",
        "text-sub-dark": "#94A3B8",
        "text-sub-light": "#64748B",
        "border-dark": "#1E293B",
        "border-light": "#E2E8F0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
        lg: "8px",
        full: "9999px",
      },
    },
  },
};

export default config;
