/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 朱紅印泥
        vermilion: {
          50: '#fff2f1',
          100: '#ffe1de',
          200: '#fdc2bd',
          400: '#ea5a52',
          500: '#d93a33',
          600: '#c9252c',
          700: '#a51b22',
          800: '#83171d',
        },
        // 護照封面：深墨綠 + 燙金
        passport: {
          900: '#14291d',
          800: '#1f3d2b',
          700: '#2a5139',
          gold: '#c9a35a',
          goldLight: '#e8cf93',
        },
        rice: '#f7f2e4',
        ricedeep: '#efe6d0',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Noto Serif TC"', '"Songti TC"', 'serif'],
      },
      keyframes: {
        'stamp-drop': {
          '0%': { transform: 'translateY(-240px) rotate(-14deg)', opacity: '0' },
          '24%': { transform: 'translateY(-150px) rotate(-6deg)', opacity: '1' },
          '48%': { transform: 'translateY(-178px) rotate(-8deg)' },
          '66%': { transform: 'translateY(0) rotate(-6deg) scaleY(0.9)' },
          '73%': { transform: 'translateY(-5px) rotate(-6deg) scaleY(1)' },
          '84%': { transform: 'translateY(0) rotate(-6deg)', opacity: '1' },
          '100%': { transform: 'translateY(-260px) rotate(-4deg)', opacity: '0' },
        },
        ink: {
          '0%': { opacity: '0', transform: 'scale(1.18)', filter: 'blur(3px)' },
          '45%': { opacity: '0.92', transform: 'scale(0.97)', filter: 'blur(0.4px)' },
          '100%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-4px, 3px)' },
          '40%': { transform: 'translate(4px, -2px)' },
          '60%': { transform: 'translate(-2px, 2px)' },
          '80%': { transform: 'translate(2px, -1px)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'pop-in': {
          from: { opacity: '0', transform: 'translateY(18px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'stamp-drop': 'stamp-drop 1.35s ease-in-out forwards',
        ink: 'ink 0.6s ease-out both',
        shake: 'shake 0.35s ease-in-out',
        'fade-in': 'fade-in 0.25s ease-out both',
        'pop-in': 'pop-in 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1) both',
        'slide-in-right': 'slide-in-right 0.4s cubic-bezier(0.2, 0.9, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
