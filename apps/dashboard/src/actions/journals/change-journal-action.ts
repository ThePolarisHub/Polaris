"use server";

import { updateProfile } from "@polaris/supabase/mutations";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "../safe-action";
import { changeJournalSchema } from "./_schema";

export const changeJournalAction = authActionClient
	.schema(changeJournalSchema)
	.action(
		async ({ parsedInput: { journalId }, ctx: { supabase, profile } }) => {
			await updateProfile(supabase, {
				journal_id: journalId,
			});

			revalidateTag(`profile_${profile.id}`);

			redirect("/");
		},
	);
