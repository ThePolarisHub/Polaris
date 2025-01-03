import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types";

export function createClient() {
	return createSupabaseClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.SUPABASE_SERVICE_KEY as string,
	);
}
