/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0D134F",
        secondary: "#1C267D",
        terniary: "#5C469B",
        other: "#D4ADFC",
      },
    },
    fontFamily: {
      'montserrat': ["Montserrat", "sans-serif"],
      'oswald': ['Oswald', 'sans-serif'],
    },
  },
};