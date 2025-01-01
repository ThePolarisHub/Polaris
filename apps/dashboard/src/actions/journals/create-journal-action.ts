"use server";

import { stripSpecialCharacters } from "@/utils";
import { createJournal, updateJournal } from "@polaris/supabase/mutations";
import { upload } from "@polaris/supabase/storage";
import { revalidateTag } from "next/dist/server/web/spec-extension/revalidate";
import { redirect } from "next/navigation";
import { authActionClient } from "../safe-action";
import { createJournalSchema } from "./_schema";

export const createJournalAction = authActionClient
	.schema(createJournalSchema)
	.action(
		async ({ parsedInput: { name, logo }, ctx: { supabase, profile } }) => {
			const journal = await createJournal(supabase, { name });
			if (journal.error) {
				throw journal.error;
			}

			if (logo) {
				const filename = stripSpecialCharacters(logo.name);
				const logoUrl = await upload(supabase, {
					bucket: "journals",
					path: [journal.data, filename],
					file: logo,
				});

				await updateJournal(supabase, {
					id: journal.data,
					logo_url: logoUrl,
				});
			}

			revalidateTag(`profile_${profile.id}`);
			revalidateTag(`journals_${profile.id}`);

			redirect("/");
		},
	);
