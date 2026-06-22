import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        paper: "#f7f4ed",
        clay: "#b86245",
        moss: "#357266",
        skyline: "#426b8f",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(23, 32, 38, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
