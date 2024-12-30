import { env } from "@polaris/env";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

const conWarn = console.warn;
const conLog = console.log;

const IGNORE_WARNINGS = [
	"Using the user object as returned from supabase.auth.getSession()",
];

console.warn = (...args) => {
	const match = args.find((arg) =>
		typeof arg === "string"
			? IGNORE_WARNINGS.find((warning) => arg.includes(warning))
			: false,
	);
	if (!match) {
		conWarn(...args);
	}
};

console.log = (...args) => {
	const match = args.find((arg) =>
		typeof arg === "string"
			? IGNORE_WARNINGS.find((warning) => arg.includes(warning))
			: false,
	);
	if (!match) {
		conLog(...args);
	}
};

type CreateClientOptions = {
	admin?: boolean;
	schema?: "public" | "storage";
};

export async function createClient(options?: CreateClientOptions) {
	const { admin = false, ...rest } = options ?? {};

	const cookieStore = await cookies();
	const headersList = await headers();

	const key = admin
		? env.SUPABASE_SERVICE_ROLE_KEY
		: env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	const auth = admin
		? {
				persistSession: false,
				autoRefreshToken: false,
				detectSessionInUrl: false,
			}
		: {};

	return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, key, {
		...rest,
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options);
					}
				} catch {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
		},
		auth,
		global: {
			headers: {
				// Pass user agent from browser
				"user-agent": headersList.get("user-agent") as string,
			},
		},
	});
}
