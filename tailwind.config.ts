/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#16a34a", // Green-600
          secondary: "#1f2937", // Gray-800
          accent: "#059669", // Green-600
          neutral: "#374151", // Gray-700
          "base-100": "#ffffff", // White
          "base-200": "#f9fafb", // Gray-50
          "base-300": "#f3f4f6", // Gray-100
          info: "#0ea5e9", // Sky-500
          success: "#16a34a", // Green-600
          warning: "#f59e0b", // Amber-500
          error: "#dc2626", // Red-600
        },
        dark: {
          primary: "#22c55e", // Green-500
          secondary: "#111827", // Gray-900
          accent: "#10b981", // Emerald-500
          neutral: "#1f2937", // Gray-800
          "base-100": "#111827", // Gray-900
          "base-200": "#1f2937", // Gray-800
          "base-300": "#374151", // Gray-700
          info: "#0ea5e9", // Sky-500
          success: "#22c55e", // Green-500
          warning: "#f59e0b", // Amber-500
          error: "#ef4444", // Red-500
        },
      },
    ],
  },
};
