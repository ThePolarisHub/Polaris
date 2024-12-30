import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	poweredByHeader: false,
	reactStrictMode: true,
	transpilePackages: ["@polaris/ui"],
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default nextConfig;
