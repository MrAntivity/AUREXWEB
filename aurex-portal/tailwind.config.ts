import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Using CSS variable format to support Tailwind opacity modifiers (e.g. bg-aurex-teal/10)
        "aurex-blue": "rgb(var(--color-aurex-blue) / <alpha-value>)",
        "aurex-blue-light": "rgb(var(--color-aurex-blue-light) / <alpha-value>)",
        "aurex-teal": "rgb(var(--color-aurex-teal) / <alpha-value>)",
        navy: {
          50: "#eef2f8",
          100: "#dce5f0",
          900: "#0f1e40",
        },
      },
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(135deg, #1e3a5f 0%, #122848 55%, #0a1a30 100%)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
