/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        proximaNova: 'Proxima Nova, sans-serif',
      },
    },
  },
  safelist: [
    'bg-gray-800'
  ],
  plugins: [],
};
