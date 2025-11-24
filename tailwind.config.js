import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C00030',
          50: '#fdf2f4',
          100: '#fde6e9',
          200: '#fbd0d9',
          300: '#f7aab8',
          400: '#f27a91',
          500: '#e63f66',
          600: '#c00030', // Base color
          700: '#a30029',
          800: '#8a0025',
          900: '#750525',
        }
      }
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
}
