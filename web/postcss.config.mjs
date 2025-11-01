export default {
  purge: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../packages/ui/**/*.tsx",
  ],
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
