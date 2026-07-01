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
        brand: {
          50: '#f2f0ff',
          100: '#e0dbff',
          200: '#c4baff',
          300: '#a18eff',
          400: '#7c5cff',
          500: '#5b2eff',
          600: '#4a15e8',
          700: '#3c0dc4',
          800: '#310d9e',
          900: '#1e0668',
        },
        accent: {
          50: '#e6fffa',
          100: '#b2f5ea',
          200: '#81e6d9',
          300: '#4fd1c5',
          400: '#38b2ac',
          500: '#00d4aa',
          600: '#00a88f',
          700: '#008c78',
          800: '#007060',
          900: '#005448',
        },
        surface: {
          dark: '#0a0a14',
          card: '#12122a',
          elevated: '#1a1a3e',
          border: '#2a2a4a',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Space Grotesk"', '"Noto Sans SC"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-grid': 'linear-gradient(rgba(91, 46, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(91, 46, 255, 0.06) 1px, transparent 1px)',
        'card-glow': 'linear-gradient(135deg, rgba(91, 46, 255, 0.15) 0%, rgba(0, 212, 170, 0.08) 100%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(91, 46, 255, 0.25), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(0, 212, 170, 0.12), transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out 1s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(91, 46, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(91, 46, 255, 0.4)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
