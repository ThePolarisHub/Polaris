import {
	JOURNAL_LOGO_ACCEPTED_IMAGE_TYPES,
	JOURNAL_LOGO_MAX_FILE_SIZE,
} from "@/utils/configuration";
import { z } from "zod";

export const createJournalSchema = z.object({
	name: z
		.string()
		.min(
			3,
			"Your journal name needs to be at least 3 characters long - add a few more!",
		)
		.max(
			32,
			"Whoa there! Could you make your journal name a bit shorter? 32 characters is our limit.",
		),
	logo: z
		.custom<File>()
		.refine(
			(file) => !file || file.size <= JOURNAL_LOGO_MAX_FILE_SIZE,
			"This image is a bit too large for us to handle. Could you try one under 5MB?",
		)
		.refine(
			(file) => !file || JOURNAL_LOGO_ACCEPTED_IMAGE_TYPES.includes(file.type),
			"We can only accept JPG, PNG or SVG images at the moment. Mind trying one of those formats?",
		)
		.optional(),
});

export const changeJournalSchema = z.object({
	journalId: z.string().uuid({
		message:
			"Hmm, that journal ID doesn't look quite right. Please try selecting a journal again.",
	}),
});
