const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(accordion|button|kbd|modal|navbar|divider|ripple|spinner).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
};
