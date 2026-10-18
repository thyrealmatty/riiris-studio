/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        br: {
          purple: '#8B7CF6',
          'purple-dark': '#6B5CE0',
          'purple-light': '#EDE9FE',
          pink: '#FF9FC7',
          'pink-light': '#FFE4F0',
          blue: '#8FD3F4',
          'blue-light': '#E3F6FF',
          white: '#FFFDF9',
          cream: '#FAF7F2',
          dark: '#241E30',
          'dark-soft': '#3A3149',
          ink: '#1C1723'
        }
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        card: '28px',
        pill: '999px'
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(60, 40, 90, 0.18)',
        pop: '0 2px 0 rgba(28, 23, 35, 0.9)'
      }
    }
  },
  plugins: []
}
