/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(240 70% 50%)',
        accent: 'hsl(170 70% 45%)',
        surface: 'hsl(0 0% 100%)',
        bg: 'hsl(230 20% 95%)',
        'text-primary': 'hsl(230 20% 20%)',
        'text-secondary': 'hsl(230 20% 50%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.08)',
      },
    },
  },
  plugins: [],
}