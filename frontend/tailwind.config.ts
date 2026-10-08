import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf9f6',
          100: '#f5efe6',
          200: '#ebdccb',
          300: '#dec4a8',
          400: '#cfa680',
          500: '#b8895b',
          600: '#9d6f45',
          700: '#7e5535',
          800: '#64432c',
          900: '#4a3222',
          950: '#26190f',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
