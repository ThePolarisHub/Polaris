import baseConfig from "@polaris/ui/tailwind.config";
import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"../../packages/ui/src/**/*.{ts,tsx}",
	],
	presets: [baseConfig],
} satisfies Config;
