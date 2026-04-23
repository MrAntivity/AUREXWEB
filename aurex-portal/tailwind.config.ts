import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "aurex-blue": "rgb(var(--color-aurex-blue) / <alpha-value>)",
        "aurex-blue-light": "rgb(var(--color-aurex-blue-light) / <alpha-value>)",
        "aurex-teal": "rgb(var(--color-aurex-teal) / <alpha-value>)",
        "dark-bg": "#0c0c13",
        "dark-elevated": "#131320",
        "dark-card": "#1a1a2a",
        navy: {
          50: "#fff7ed",
          100: "#ffedd5",
          900: "#111827",
        },
      },
      backgroundImage: {
        "hero-pattern": "linear-gradient(135deg, #0c0c13 0%, #131320 100%)",
      },
      fontFamily: {
        sans: ["Figtree", "sans-serif"],
        display: ["Barlow Condensed", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
