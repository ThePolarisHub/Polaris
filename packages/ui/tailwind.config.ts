import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	darkMode: ["class"],
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-geist-sans)", ...fontFamily.sans],
				mono: ["var(--font-geist-mono)", ...fontFamily.mono],
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",

				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},

				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},

				destructive: {
					DEFAULT: "hsl(var(--destructive))",
				},
				success: {
					DEFAULT: "hsl(var(--success))",
				},

				ring: "hsl(var(--ring))",
				border: "hsl(var(--border))",

				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					accent: "hsl(var(--sidebar-accent))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [animate],
} satisfies Config;
