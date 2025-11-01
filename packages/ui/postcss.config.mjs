// eslint-disable-next-line no-undef
export default {
  purge: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,jsx,ts,tsx}",
    "./**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
    "./stories/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "!**/node_modules/**",
  ],
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
