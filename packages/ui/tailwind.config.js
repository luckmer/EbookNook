const theme = require("./common/theme");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./.storybook/**/*.{js,jsx,ts,tsx}",
    "./**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
    "./stories/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "!**/node_modules/**",
  ],
  theme: theme,
  plugins: [],
};
