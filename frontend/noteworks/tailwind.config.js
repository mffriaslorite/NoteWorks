/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      //colors used in the project
      colors: {
        primary: "#2B85FF",
        secondary: "#EF863E",
      }
    },
  },
  variants: {
    extend: {
      borderColor:['hover'],
      backgroundColor:['hover'],
    },
  },
  plugins: [],
}

