import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        pop: 'pop 200ms ease-out',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg|text|border|from|to|ring|fill|shadow)-(red|orange|amber|yellow|lime|emerald|teal|cyan|sky|blue|indigo|violet|purple|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    { pattern: /^(bg|text|border)-(green|gray|slate)-(50|100|200|400|500|700|800|900)$/ },
  ],
  plugins: [],
} satisfies Config;
