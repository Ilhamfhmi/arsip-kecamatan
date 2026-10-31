import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy:    "#1E3A5F",  // sidebar, header
          blue:    "#2D6A9F",  // primary button, link
          sky:     "#4299E1",  // accent, hover
          light:   "#EBF4FF",  // highlight bg
          surface: "#F8FAFC",  // page background
          border:  "#E2E8F0",  // border, divider
          text:    "#1A202C",  // heading
          muted:   "#64748B",  // subtext
        },
        status: {
          green:  "#16A34A",  // Lengkap 🟢
          yellow: "#D97706",  // Sebagian 🟡
          red:    "#DC2626",  // Tidak ada 🔴
          blue:   "#2563EB",  // Dalam proses 🔵
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;