import type { Client, Database, TablesInsert, TablesUpdate } from "../types";

export async function updateProfile(
	supabase: Client,
	profile: TablesUpdate<"profiles">,
) {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		throw new Error("User not authenticated");
	}

	return await supabase
		.from("profiles")
		.update(profile)
		.eq("id", session.user.id)
		.select()
		.single()
		.throwOnError();
}

export async function createJournal(
	supabase: Client,
	params: Database["public"]["Functions"]["create_journal"]["Args"],
) {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		throw new Error("User not authenticated");
	}

	return await supabase.rpc("create_journal", params).throwOnError();
}

export async function updateJournal(
	supabase: Client,
	params: TablesUpdate<"journals">,
) {
	if (!params.id) {
		throw new Error("Journal ID is required");
	}

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		throw new Error("User not authenticated");
	}

	return await supabase
		.from("journals")
		.update(params)
		.eq("id", params.id)
		.select()
		.single();
}

export async function insertTrade(
	supabase: Client,
	trade: TablesInsert<"trades">,
) {
	// const {
	// 	data: { session },
	// } = await supabase.auth.getSession();

	// if (!session?.user) {
	// 	throw new Error("User not authenticated");
	// }

	return await supabase
		.from("trades")
		.insert(trade)
		.select()
		.single()
		.throwOnError();
}

export async function insertTransactions(
	supabase: Client,
	transactions: TablesInsert<"transactions">[],
) {
	// const {
	// 	data: { session },
	// } = await supabase.auth.getSession();

	// if (!session?.user) {
	// 	throw new Error("User not authenticated");
	// }

	return await supabase
		.from("transactions")
		.insert(transactions)
		.select()
		.throwOnError();
}

export async function upsertTrade(
	supabase: Client,
	trade: TablesInsert<"trades">,
) {
	// const {
	// 	data: { session },
	// } = await supabase.auth.getSession();

	// if (!session?.user) {
	// 	throw new Error("User not authenticated");
	// }

	return await supabase
		.from("trades")
		.upsert(trade, { onConflict: "id" })
		.select()
		.single()
		.throwOnError();
}

export async function upsertTransactions(
	supabase: Client,
	transactions: TablesInsert<"transactions">[],
) {
	// const {
	// 	data: { session },
	// } = await supabase.auth.getSession();

	// if (!session?.user) {
	// 	throw new Error("User not authenticated");
	// }

	return await supabase
		.from("transactions")
		.upsert(transactions, { onConflict: "id" })
		.select()
		.throwOnError();
}
