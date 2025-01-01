import type { Client } from "../types";

export async function getProfileQuery(supabase: Client, userId: string) {
	return supabase
		.from("profiles")
		.select(`
			*,
			journal:journals!journal_id(*)
			`)
		.eq("id", userId)
		.single()
		.throwOnError();
}

export async function getJournalsQuery(supabase: Client, userId: string) {
	return supabase
		.from("journal_members")
		.select(`
			role,
			...journals!journal_id(*)
			`)
		.eq("user_id", userId)
		.throwOnError();
}
