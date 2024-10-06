/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex:{
        '999999': '999999',
        '2147483647': '2147483647',
      }
    },
  },
  plugins: [],
}

