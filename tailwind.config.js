/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './types/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        // Teal/Mint green primary - matching the design
        primary: {
          50: '#effefb',
          100: '#c9fef4',
          200: '#93fceb',
          300: '#56f2de',
          400: '#23dfcc',
          500: '#0ac5b3',
          600: '#059e93',
          700: '#097e77',
          800: '#0d6460',
          900: '#10524f',
        },
        // Accent colors for stats
        accent: {
          teal: '#0ac5b3',
          blue: '#3b82f6',
          amber: '#f59e0b',
          purple: '#8b5cf6',
          rose: '#f43f5e',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'sidebar': '4px 0 6px -1px rgb(0 0 0 / 0.05)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
