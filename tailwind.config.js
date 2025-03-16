// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}", // Ajusta la ruta a tu proyecto Angular
    ],
    theme: {
      extend: {
        colors: {
          'sponge': '#A200F4', // Nombre personalizado y valor hexadecimal
        },
        fontFamily: {
          'montserrat': ['Montserrat', 'sans-serif'],
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }
  