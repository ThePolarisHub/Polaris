import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	client: {
		NEXT_PUBLIC_SUPABASE_URL: z.string(),
		NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
	},
	server: {
		SUPABASE_SERVICE_ROLE_KEY: z.string(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
	},
});
