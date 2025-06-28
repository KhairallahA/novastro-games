/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'nova-green': '#25C198',
        'nova-dark': '#0E1E20'
      }
    }
  },
  plugins: []
};
  