/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.php',
    "./src/**/*.{html,css,js}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}

