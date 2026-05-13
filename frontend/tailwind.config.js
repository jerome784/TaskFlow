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
          olive: "#6366f1",   // Vibrant Indigo
          beige: "#eef2ff",   // Very light indigo tint for sidebars
          cream: "#faf5ff",   // Very light fuchsia tint for main bg
          brown: "#7c3aed",   // Deep vibrant violet for borders and secondary text
          charcoal: "#1e1b4b", // Deep indigo for main text
          gold: "#0ea5e9",    // Vibrant Sky blue for highlights
          // Dark Mode Variants
          'dark-bg': '#0f172a',
          'dark-surface': '#1e293b',
          'dark-border': '#334155',
          'dark-text': '#f8fafc',
          'dark-text-muted': '#94a3b8'
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
