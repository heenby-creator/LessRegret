/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FDFBF7",
        ink: "#2C2825",
        mute: "#6E655C",
        line: "#E6DFD4",
        clay: "#8C5A3C",
        sand: "#E7C4A8",
        dusk: "#12151A",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Iowan Old Style", "Palatino Linotype", "serif"],
        sans: ["var(--font-sans)", "Pretendard", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.75) inset, 0 22px 50px rgba(74, 52, 32, 0.12)",
      },
    },
  },
  plugins: [],
};
