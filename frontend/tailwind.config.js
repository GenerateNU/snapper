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
        ocean: '#3788be',
        water: '#d0e2ee',
        skyblue: '#90bfdf',
        deep: '#416884',
        darkblue: '#214f70',
        primary: {
          blue: '#d4ecfc',
        },
        background: '#d1d9e2',
      },
    },
  },
  plugins: [],
};
