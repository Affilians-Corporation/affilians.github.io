/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.{html, js}", "./components/*.{html, js}", "./src/*.{html, js}"],
    theme: {
        fontFamiliy: {
            'lobster': 'lobster'
        },
        extend: {},
        colors: {
            'primary': "#191919",
            'secondary': "#E6E6E6",
            'accent': "#FFD700"
        }
    },
    plugins: [],
  }