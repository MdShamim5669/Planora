import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F1F5F9",
          hover: "#E2E8F0",
          foreground: "#0F172A",
        },
        background: "#F8FAFC",
        foreground: "#0F172A",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
        border: "#E2E8F0",
        muted: {
          DEFAULT: "#64748B",
          background: "#F1F5F9",
        },
        accent: "#6366F1",
        destructive: "#EF4444",
        success: "#10B981",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        default: "0.5rem",
        badge: "9999px",
      },
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        "border-beam": {
          "100%": {
            offsetDistance: "100%",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
