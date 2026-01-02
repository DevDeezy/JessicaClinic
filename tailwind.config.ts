import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c6cfc6',
          300: '#a1afa1',
          400: '#7a8d7a',
          500: '#5f725f',
          600: '#4a5b4a',
          700: '#3d4a3d',
          800: '#333d33',
          900: '#2c332c',
          950: '#161a16',
        },
        cream: {
          50: '#fdfcfa',
          100: '#f9f6f0',
          200: '#f3ede1',
          300: '#e9dfcc',
          400: '#dccdb0',
          500: '#cfba94',
          600: '#bea176',
          700: '#a48660',
          800: '#866d51',
          900: '#6e5a45',
          950: '#3a2f23',
        },
        terracotta: {
          50: '#fdf6f3',
          100: '#fceae4',
          200: '#fad8cd',
          300: '#f5bda9',
          400: '#ed9678',
          500: '#e2724d',
          600: '#cf5835',
          700: '#ad462a',
          800: '#8f3c27',
          900: '#773626',
          950: '#401910',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
