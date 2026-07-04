/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F3A',
        'navy-soft': '#12365D',
        gold: '#F4B942',
        'gold-soft': '#FFE5A3',
        stone: '#F5F7FA',
      },
      boxShadow: {
        card: '0 18px 45px rgba(11, 31, 58, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
