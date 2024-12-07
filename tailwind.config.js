/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        system: ["Roboto Mono Variable", "monospace"],
      },
    },
  },
  plugins: [],
};
