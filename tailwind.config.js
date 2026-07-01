/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ----- New Color System (Phase A) ----- */
      colors: {
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        /* Surface layers (tailwind extended) */
        surface: {
          ground:   '#09090b',
          card:     '#121214',
          elevated: '#1a1a1f',
          overlay:  '#222228',
          border:   '#1e1e24',
        },
        /* Semantic scene colors */
        scene: {
          market:    '#f59e0b',   /* amber */
          community: '#06b6d4',   /* cyan  */
          creator:   '#a855f7',   /* purple*/
          brand:     '#8b5cf6',   /* violet*/
        },
      },

      /* ----- Typography ----- */
      fontFamily: {
        sans: [
          '"Inter"',
          '"Noto Sans SC"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        display: [
          '"Inter"',
          '"Noto Sans SC"',
          '-apple-system',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'monospace',
        ],
      },

      fontSize: {
        'xs':   ['12px', { lineHeight: '1.45', letterSpacing: '0.01em' }],
        'sm':   ['13px', { lineHeight: '1.5',  letterSpacing: '0' }],
        'base': ['15px', { lineHeight: '1.6',  letterSpacing: '-0.01em' }],
        'lg':   ['17px', { lineHeight: '1.55', letterSpacing: '-0.01em' }],
        'xl':   ['20px', { lineHeight: '1.3',  letterSpacing: '-0.02em' }],
        '2xl':  ['24px', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '3xl':  ['30px', { lineHeight: '1.2',  letterSpacing: '-0.03em' }],
        '4xl':  ['38px', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
      },

      /* ----- Spacing (slightly tighter) ----- */
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
      },

      /* ----- Border Radius ----- */
      borderRadius: {
        'sm':  '6px',
        'md':  '10px',
        'lg':  '14px',
        'xl':  '20px',
        '2xl': '28px',
      },

      /* ----- Background Images ----- */
      backgroundImage: {
        'hero-grid': 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'card-glow': 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.06) 100%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(139, 92, 246, 0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(6, 182, 212, 0.08), transparent 50%)',
      },

      /* ----- Shadows ----- */
      boxShadow: {
        'card':     '0 1px 2px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)',
        'elevated': '0 2px 4px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
        'overlay':  '0 4px 8px rgba(0,0,0,0.5), 0 16px 40px rgba(0,0,0,0.35)',
        'glow-brand': '0 0 24px rgba(139, 92, 246, 0.15)',
      },

      /* ----- Animations ----- */
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out 1s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'countUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(139, 92, 246, 0.15)' },
          '50%': { boxShadow: '0 0 32px rgba(139, 92, 246, 0.3)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
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
