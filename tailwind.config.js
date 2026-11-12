/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FDFBF7',
        paperMuted: '#F4EFE6',
        ink: '#1A1816',
        inkMuted: '#6E665C',
        inkFaint: '#A3998D',
        accentGold: '#C2A382',
        borderSoft: '#E8E2D8',
      },
      fontFamily: {
        serif: ['Noto Serif KR', 'Georgia', 'serif'],
        sans: ['Pretendard', 'Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
