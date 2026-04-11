import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        inca: {
          gold: '#C9A84C',
          'gold-light': '#D4B665',
          'gold-dark': '#A0832A',
          dark: '#0D0600',
          brown: '#1A0A00',
          'brown-2': '#2C1A0A',
          'brown-3': '#3D2B1A',
          'brown-4': '#4E3A28',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(201,168,76,0)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        fadeIn: 'fadeIn 0.8s ease forwards',
        slideUp: 'slideUp 0.6s ease forwards',
        pulseGold: 'pulseGold 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
