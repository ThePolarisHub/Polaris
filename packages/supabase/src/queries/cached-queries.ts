import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient } from "../clients/server";
import { getProfileQuery } from "./index";

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
