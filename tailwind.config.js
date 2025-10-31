/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        success: '#10b981',
        danger: '#ef4444',
        admin: '#9333ea'
      }
    },
  },
  plugins: [],
}


