/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/frontend/**/*.{html,js}",
    "./src/frontend/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fbbf24', // Minion yellow
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#87ceeb', // Light blue
          foreground: '#000000',
        },
        success: '#10b981',
        warning: '#f59e0b',
        background: '#ffffff',
        foreground: '#000000',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#000000',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#fbbf24',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

