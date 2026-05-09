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
        // Luxury Organic Color Palette
        primary: {
          50: "#f5f7f4",
          100: "#e8ede5",
          200: "#d1dbc9",
          300: "#b1c3a4",
          400: "#8fa67e",
          500: "#8B9D83", // Main sage green
          600: "#6d7e66",
          700: "#586553",
          800: "#495345",
          900: "#3d453a",
        },
        secondary: {
          50: "#fafaf8",
          100: "#f5f3ef",
          200: "#eae7dc",
          300: "#dcd7c8",
          400: "#ccc4b1",
          500: "#bab09a",
          600: "#a0947c",
          700: "#847a65",
          800: "#6d6554",
          900: "#5a5447",
        },
        accent: {
          50: "#f7f5f3",
          100: "#ede9e3",
          200: "#ddd4c7",
          300: "#c9b9a4",
          400: "#b39b7f",
          500: "#a0826d",
          600: "#8b7355",
          700: "#735f47",
          800: "#61503e",
          900: "#524436",
        },
        earth: {
          50: "#f6f6f5",
          100: "#e7e7e6",
          200: "#d1d1cf",
          300: "#b0b0ad",
          400: "#888885",
          500: "#6d6d6a",
          600: "#5a5a58",
          700: "#4a4a49",
          800: "#3f3f3e",
          900: "#2c3333",
        },
        cream: "#F5F3EF",
        sage: "#8B9D83",
        bark: "#8B7355",
        moss: "#A8B5A0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.6s ease-out",
        "slide-left": "slideLeft 0.6s ease-out",
        "slide-right": "slideRight 0.6s ease-out",
        "scale-in": "scaleIn 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-organic":
          "linear-gradient(135deg, #8B9D83 0%, #A8B5A0 50%, #8B7355 100%)",
        "gradient-cream":
          "linear-gradient(to bottom, #FAFAF8 0%, #F5F3EF 100%)",
      },
      boxShadow: {
        organic:
          "0 4px 20px rgba(139, 157, 131, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)",
        "organic-lg":
          "0 10px 40px rgba(139, 157, 131, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)",
        "organic-xl":
          "0 20px 60px rgba(139, 157, 131, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;