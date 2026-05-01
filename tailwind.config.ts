import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#3f6900",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#4a6729",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        "secondary-container": "#c9eb9e",
        "surface-dim": "#dad9e5",
        "surface-bright": "#fbf8ff",
        "on-secondary-fixed": "#102000",
        "error-container": "#ffdad6",
        "inverse-primary": "#96d945",
        "surface-variant": "#e2e1ee",
        "surface": "#fbf8ff",
        "primary-fixed-dim": "#96d945",
        "on-background": "#1a1b24",
        "surface-container-low": "#f4f2ff",
        "tertiary": "#6d5b52",
        "secondary-fixed-dim": "#b0d187",
        "surface-container-high": "#e8e7f4",
        "inverse-on-surface": "#f1effc",
        "on-tertiary": "#ffffff",
        "on-primary-fixed": "#102000",
        "error": "#ba1a1a",
        "on-primary-container": "#477600",
        "on-secondary": "#ffffff",
        "on-primary-fixed-variant": "#2e4f00",
        "on-surface": "#1a1b24",
        "on-secondary-container": "#4f6b2d",
        "on-surface-variant": "#424937",
        "surface-container-highest": "#e2e1ee",
        "on-primary": "#ffffff",
        "primary-container": "#b9ff66",
        "surface-container": "#eeecfa",
        "on-error-container": "#93000a",
        "tertiary-container": "#ffe6da",
        "tertiary-fixed-dim": "#d9c2b6",
        "secondary-fixed": "#cceea1",
        "on-secondary-fixed-variant": "#344e13",
        "primary-fixed": "#b1f65f",
        "on-error": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "surface-tint": "#3f6900",
        "outline": "#727a66",
        "on-tertiary-fixed": "#251912",
        "on-tertiary-fixed-variant": "#54433b",
        "on-tertiary-container": "#78665c",
        "outline-variant": "#c2cab2",
        "inverse-surface": "#2f3039",
        "tertiary-fixed": "#f6ded2",
        green: {
          DEFAULT: "#B9FF66",
          light: "#C7FF85",
          dark: "#A8E855",
        },
        brand: {
          green: "#B9FF66",
          dark: "#191A23",
        },
        gray: {
          subtle: "#686363",
        },
        slate: {
          900: "#0F172A",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        DEFAULT: "0.125rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      fontFamily: {
        headline: ["var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        label: ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        brand: "0px 5px 0px #191A23",
        "brand-lg": "0px 8px 0px #191A23",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;