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
      aspectRatio:{
        video: '16 / 9'
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Add this plugin
  ],
}

