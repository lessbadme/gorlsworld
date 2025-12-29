/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We can add custom colors here based on your Figma designs
        // e.g., 'youtube-red': '#FF0000',
      },
      fontFamily: {
        // Custom fonts if needed
      },
    },
  },
  plugins: [],
}
