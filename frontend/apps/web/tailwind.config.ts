import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b1020",
        panel: "#121a2f",
        panelSoft: "#17213a",
        line: "#24304d",
        text: "#e5ecff",
        muted: "#96a3c7",
        accent: "#74d7ff",
        accent2: "#8bffb6",
        warning: "#ffd166",
        danger: "#ff7a90"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(8, 12, 24, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
