/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        offwhite: '#F5F5F0',
        retina: {
          red: '#8F1515',
          accent: '#E0533C',
          deep: '#350808',
          card: 'rgba(20, 20, 20, 0.6)',
          border: 'rgba(255, 255, 255, 0.1)',
          surface: '#0d0d0d',
          navy: '#050505',
          cyan: '#E0533C',
          cyanGlow: '#8F1515',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#8F1515',
          muted: '#9CA3AF'
        }
      }
    },
  },
  plugins: [],
}
