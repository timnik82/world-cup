import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: ".75rem", /* 12px - more rounded for kids */
        md: ".5rem", /* 8px */
        sm: ".25rem", /* 4px */
        xl: "1rem", /* 16px */
        "2xl": "1.5rem", /* 24px */
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Poppins", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)"],
        display: ["Poppins", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
