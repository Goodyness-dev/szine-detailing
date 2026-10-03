/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#06b6d4',
          primaryHover: '#0891b2',
          secondary: '#0f172a',
          accent: '#f59e0b',
          bgDark: '#060709',
          surfaceDark: '#0d0f14',
          borderDark: '#1a202c',
        },
        midnight: {
          DEFAULT: '#060709',
          pure: '#000000',
          card: '#0d0f14',
          cardHover: '#131720',
          border: '#1a202c',
          subtle: '#242c3d',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
