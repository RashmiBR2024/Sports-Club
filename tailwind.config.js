/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        // Small phones and below
        sm: "480px",       // Small phones like iPhone SE (2020), Android small screens
        // Standard phones
        md: "768px",       // Standard mobile devices like iPhone 12, Galaxy S21
        // Tablets
        tablet: "1024px",  // Tablets like iPad (portrait mode), large phones in landscape
        // Small laptops
        lg: "1280px",      // Small laptops or larger tablets in landscape
        // Standard desktops
        laptop: "1440px",
        xl: "1536px",      // Standard desktops and medium monitors
        // Large desktops
        "2xl": "1920px",   // Widescreens or high-definition displays
        // Extra large monitors
        "3xl": "2560px",   // Extra-wide monitors
        // Ultra-wide screens
        "4xl": "3200px",   // Ultra-wide or high-end setups
      },      
      fontFamily: {
        prosto: ['"Prosto One"', 'cursive'],
      },
      colors: {
        'footer-bg': '#f3f4f6', // Example custom color
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
