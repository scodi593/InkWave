/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'vivante': ['Brush Script MT', 'cursive'],
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'inkwave-blue': '#3b82f6',
        'inkwave-purple': '#8b5cf6',
      },
    },
  },
  plugins: [],
} 