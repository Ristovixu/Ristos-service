/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        'surface-2': 'var(--c-surface-2)',
        ink: 'var(--c-ink)',
        'ink-soft': 'var(--c-ink-soft)',
        'ink-ghost': 'var(--c-ink-ghost)',
        accent: 'var(--c-accent)',
        'accent-hover': 'var(--c-accent-hover)',
        'accent-alt': 'var(--c-accent-alt)',
        'accent-glow': 'var(--c-accent-glow)',
        border: 'var(--c-border)',
        'border-mid': 'var(--c-border-mid)',
        'border-strong': 'var(--c-border-strong)',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        none: '0',
      },
    },
  },
  plugins: [],
};
