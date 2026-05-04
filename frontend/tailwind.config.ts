import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        moss: "#2f5d50",
        mint: "#d8efe6",
        coral: "#ff6f61",
        amber: "#f5b04d",
        paper: "#fbfaf7",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 27, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
