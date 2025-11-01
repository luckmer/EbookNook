import theme from "../packages/ui/common/theme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../packages/ui/**/*.{ts,tsx}",
    "!**/node_modules/**",
  ],
  theme: theme,
  plugins: [],
};
