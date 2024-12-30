import type { Client } from "@/types";

export async function getProfileQuery(supabase: Client, userId: string) {
	return supabase
		.from("profiles")
		.select("*")
		.eq("id", userId)
		.single()
		.throwOnError();
}
