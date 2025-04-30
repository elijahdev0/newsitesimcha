/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f1f3',
          100: '#d1d5dd',
          200: '#b2b9c8',
          300: '#939eb2',
          400: '#74829d',
          500: '#5c6a87',
          600: '#485269',
          700: '#353b4c',
          800: '#21232e',
          900: '#0e0e15',
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        tactical: {
          50: '#f8f9fa',
          100: '#ebedf0',
          200: '#d4d6dd',
          300: '#b0b4c1',
          400: '#888fa1',
          500: '#6b7286',
          600: '#565b6e',
          700: '#40414f',
          800: '#2a2c36',
          900: '#18191f',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        heading: ['"Rajdhani"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};