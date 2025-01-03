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

export async function getTradesQuery(supabase: Client, journalId: string) {
	return supabase
		.from("trades")
		.select(`
			*,
			transactions:transactions!trade_id(*)
			`)
		.eq("journal_id", journalId)
		.throwOnError();
}
