/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: '#3688be',
        water: '#d0e2ee',
        deep: '#416884',
        darkblue: '#214f70',
      },
    },
  },
  plugins: [],
};
