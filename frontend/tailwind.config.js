/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        vintage: {
          olive: "#556B2F",
          beige: "#E8DCCB",
          cream: "#F5EFE6",
          brown: "#8B6F47",
          charcoal: "#2E2A26",
          gold: "#C8A96B",
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url('/assets/paper-texture.png')", // We will generate this
      }
    },
  },
  plugins: [],
}
