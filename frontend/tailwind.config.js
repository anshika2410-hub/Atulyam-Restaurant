/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8f1',
          100: '#feeedb',
          200: '#fcd6b3',
          300: '#fab980',
          400: '#f7934a',
          500: '#E07A24', // signature Atulyam warm vibrant orange
          600: '#cf5e17',
          700: '#ab4415',
          800: '#893618',
          900: '#702e17',
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#F59E0B',
          600: '#d97706',
        },
        dark: {
          950: '#060607', // deepest obsidian
          900: '#0B0B0C', // primary canvas
          850: '#111114', // primary surface
          800: '#16161B', // elevated card surface
          750: '#1E1E26',
          700: '#272732', // subtle borders
          600: '#383848',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FDFBF7', // warm off-white headline
          200: '#F4EFE6', // subtle champagne
          300: '#EAE5DE', // soft body text
          400: '#C8C2B9', // muted secondary
          500: '#9E988F', // subtle captions
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest-xl': '0.22em',
        'widest-2xl': '0.35em',
        'monumental': '0.45em',
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(224, 122, 36, 0.35)',
        'glow-lg': '0 0 45px -5px rgba(224, 122, 36, 0.45)',
        'glow-subtle': '0 4px 20px 0 rgba(224, 122, 36, 0.15)',
        'inner-amber': 'inset 0 0 15px 0 rgba(224, 122, 36, 0.12)',
      }
    },
  },
  plugins: [],
}
