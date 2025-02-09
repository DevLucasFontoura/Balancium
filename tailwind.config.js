/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00A86B',
          dark: '#008F5D',
        },
        secondary: '#2D3748',
        accent: '#FFD700',
        background: '#F7FAFC',
      },
    },
  },
  darkMode: 'media',
  plugins: [],
}

