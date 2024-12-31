import { getProfile } from "@polaris/supabase/cached-queries";
import { createClient } from "@polaris/supabase/server";
import {
	DEFAULT_SERVER_ERROR_MESSAGE,
	createSafeActionClient,
} from "next-safe-action";

export const actionClient = createSafeActionClient({
	handleServerError: (error) => {
		if (error instanceof Error) {
			return error.message;
		}

		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
	defaultValidationErrorsShape: "flattened",
});

export const authActionClient = actionClient.use(async ({ next }) => {
	const profile = await getProfile();
	const supabase = await createClient();

	if (!profile?.data) {
		throw new Error(
			"You must be logged in to perform this action. Please sign in and try again.",
		);
	}

	return next({
		ctx: {
			supabase,
			profile: profile.data,
		},
	});
});
