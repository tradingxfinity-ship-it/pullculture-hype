import type { Config } from "tailwindcss";

// Every value maps back to a CSS variable in app/globals.css so the design
// tokens live in one place and Tailwind only provides the ergonomics.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1600px",
    },
    extend: {
      colors: {
        ink: {
          0: "var(--bg-0)",
          1: "var(--bg-1)",
          2: "var(--bg-2)",
          3: "var(--bg-3)",
          4: "var(--bg-4)",
          5: "var(--bg-5)",
        },
        fg: {
          DEFAULT: "rgb(var(--fg-rgb) / <alpha-value>)",
          2: "var(--fg-2)",
          muted: "var(--fg-muted)",
          dim: "var(--fg-dim)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          ink: "var(--accent-ink)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        tier: {
          silver: "rgb(var(--silver-rgb) / <alpha-value>)",
          gold: "rgb(var(--gold-rgb) / <alpha-value>)",
          platinum: "rgb(var(--platinum-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        // Editorial scale — deliberate jumps between metadata and display.
        "display-sm": ["clamp(2rem, 4.2vw, 3.5rem)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(2.5rem, 6vw, 5.5rem)", { lineHeight: "0.9", letterSpacing: "-0.045em" }],
        "display-lg": ["clamp(3.5rem, 10vw, 10rem)", { lineHeight: "0.85", letterSpacing: "-0.055em" }],
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
      },
      spacing: {
        gutter: "var(--gutter)",
        rail: "var(--rail-w)",
        section: "var(--section-y)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        pulse_dot: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(117,251,181,0.55)" },
          "50%": { boxShadow: "0 0 0 6px rgba(117,251,181,0)" },
        },
        spin_y: { from: { transform: "rotateY(0deg)" }, to: { transform: "rotateY(360deg)" } },
      },
      animation: {
        marquee: "marquee var(--marquee-dur, 40s) linear infinite",
        "pulse-dot": "pulse_dot 2s var(--ease-in-out) infinite",
        "spin-y": "spin_y 9s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
