/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none', // Remove prose max-width
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Add this plugin
  ],
}

