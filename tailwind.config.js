/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pulsar-pink': '#DE64A5',
        'pulsar-pink-light': '#E268A5',
        'pulsar-pink-dark': '#c9548f',
        'pulsar-blue': '#44C8E8',
        'pulsar-blue-dark': '#35b3d1',
        'pulsar-dark': '#1E1E1E',
        'pulsar-light-blue': '#D4F1F9',
        'pulsar-light-blue-bg': '#E8F7FB',
      },
      fontFamily: {
        'futura': ['"Futura PT"', 'Futura', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-pink': '0 0 30px rgba(222, 100, 165, 0.3)',
        'glow-blue': '0 0 30px rgba(68, 200, 232, 0.3)',
      },
      borderRadius: {
        'pill': '50px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
}
