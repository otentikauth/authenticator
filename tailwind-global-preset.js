const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: ({ colors }) => ({
        gray: colors.slate,
        black: '#13111d',
        brand: {
          50: '#f0f5fe',
          100: '#dde9fc',
          200: '#c3d8fa',
          300: '#9ac1f6',
          400: '#6ba0ef',
          500: '#487de9',
          600: '#2b5adc',
          700: '#2a4ccb',
          800: '#283fa5',
          900: '#253a83',
        },
        accent: {
          50: '#f0f9f3',
          100: '#daf1e0',
          200: '#b7e3c5',
          300: '#88cda2',
          400: '#56b17b',
          500: '#33925d',
          600: '#24774a',
          700: '#1d5f3d',
          800: '#194c32',
          900: '#153f2a',
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
  ],
}
