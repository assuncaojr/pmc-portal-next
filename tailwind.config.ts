import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pmc: {
          primary: "#2073E6", // Azul Principal
          secondary: "#FF0000", // Vermelho
          tertiary: "#33CC33", // Verde
          warning: "#FCB900", // Amarelo Luminous Amber
          dark: "#1A1A1A",
          light: "#F5F5F5",
        }
      },
      fontFamily: {
        jost: ["var(--font-jost)", "sans-serif"],
      }
    },
  },
  plugins: [],
} satisfies Config;
