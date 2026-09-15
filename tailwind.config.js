/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        power: {
          300: '#6df6ff',
          400: '#00e5ff',
          500: '#00b8cc',
          950: '#020507'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif']
      },
      boxShadow: {
        cyan: '0 0 40px rgba(0,229,255,.14)'
      }
    }
  },
  plugins: []
}