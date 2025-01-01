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
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb",
		},
	},
};

export default nextConfig;
