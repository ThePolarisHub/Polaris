"use server";

import { getSession } from "@polaris/supabase/cached-queries";
import { createClient } from "@polaris/supabase/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { actionClient } from "../safe-action";

export const signOutAction = actionClient.action(async () => {
	const supabase = await createClient();
	const {
		data: { session },
	} = await getSession();

	await supabase.auth.signOut();

	revalidateTag(`profile_${session?.user.id}`);

	redirect("/login");
});
