/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans, sans-serif',
          {
            ...defaultTheme.fontFamily.sans,
            fontFeatureSettings: '"tnum"',
            fontVariationSettings: "normal",
          }
        ],
      },
    },
  },
  plugins: [],
}

