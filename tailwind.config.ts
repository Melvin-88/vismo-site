import type { Config } from 'tailwindcss';

// Тема = токени з globals.css (той самий набір, що в макеті resources/index.html)
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: 'var(--graphite)', 'graphite-2': 'var(--graphite-2)', 'graphite-3': 'var(--graphite-3)',
        lime: 'rgb(var(--lime-rgb) / <alpha-value>)', 'lime-on-light': 'var(--lime-on-light)', 'off-white': 'var(--off-white)',
        gray: 'rgb(var(--gray-rgb) / <alpha-value>)', 'gray-on-light': 'var(--gray-on-light)', error: 'var(--error)',
      },
      fontFamily: { sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'] },
      borderRadius: { card: 'var(--radius-card)', field: 'var(--radius-field)' },
      maxWidth: { container: '1200px', prose: '65ch' },
    },
  },
} satisfies Config;
