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
        primary: "#16a34a",
        "primary-hover": "#15803d",
      },
      fontFamily: {
        sans: ['DM Sans', 'Segoe UI', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s infinite',
      },
    },
  },
  plugins: [],
};
export default config;
