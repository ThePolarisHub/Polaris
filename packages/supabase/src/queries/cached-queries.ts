import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient } from "../clients/server";
import { getJournalsQuery, getProfileQuery, getTradesQuery } from "./index";

// Cache per request
export const getSession = cache(async () => {
	const supabase = await createClient();

	return supabase.auth.getSession();
});

export const getProfile = async () => {
	const {
		data: { session },
	} = await getSession();

	const userId = session?.user?.id;

	if (!userId) {
		return null;
	}

	const supabase = await createClient();

	return unstable_cache(
		async () => {
			return getProfileQuery(supabase, userId);
		},
		["profile", userId],
		{
			tags: [`profile_${userId}`],
			// 30 minutes, jwt expires in 1 hour
			revalidate: 1800,
		},
	)();
};

export const getJournals = async () => {
	const {
		data: { session },
	} = await getSession();

	const userId = session?.user?.id;

	if (!userId) {
		return null;
	}

	const supabase = await createClient();

	return unstable_cache(
		async () => {
			return getJournalsQuery(supabase, userId);
		},
		["journals", userId],
		{
			tags: [`journals_${userId}`],
			revalidate: 180,
		},
	)();
};

export const getTrades = async (journalId: string) => {
	const {
		data: { session },
	} = await getSession();

	const userId = session?.user?.id;

	if (!userId) {
		return null;
	}

	const supabase = await createClient();

	return unstable_cache(
		async () => {
			return getTradesQuery(supabase, journalId);
		},
		["trades", journalId],
		{
			tags: [`trades_${journalId}`],
			revalidate: 600,
		},
	)();
};
