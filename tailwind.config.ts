import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Flock brand — deep navy authority + warm gold accent
        // Navy = trust, structure, institution
        // Gold = warmth, church, stewardship
        navy: {
          50: "#EEF2F9",
          100: "#D5E0F0",
          200: "#ABBFE1",
          300: "#7A97CE",
          400: "#4F73B8",
          500: "#2D52A0",
          600: "#1E3D82",
          700: "#152D62",
          800: "#0D1E44",
          900: "#080F25",
          950: "#040812",
        },
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        // Semantic aliases
        brand: {
          primary: "#1E3D82",
          accent: "#F59E0B",
          surface: "#F8F9FC",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
