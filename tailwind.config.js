/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black_light: "#292D32",
        primary: "#181818",
        secondary: "#F9FAFA",
        background: "#F9FAFA",
        brown: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          200: "#eaddd7",
          300: "#e0cec7",
          400: "#d2bab0",
          500: "#bfa094",
          600: "#a18072",
          700: "#977669",
          800: "#846358",
          900: "#43302b",
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          ".input": {
            "border-radius": 16,
          },
          ".btn": {
            "border-radius": 40,
          },
          ".btn-primary": {
            color: "white",
          },
          primary: "#181818",
          success: "#56B37E",
          "--padding-card": "24px",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
