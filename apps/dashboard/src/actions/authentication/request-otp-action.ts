"use server";

import { createClient } from "@polaris/supabase/server";
import { actionClient } from "../safe-action";
import { requestOtpCodeSchema } from "./_schema";

export const requestOtpCodeAction = actionClient
	.schema(requestOtpCodeSchema)
	.action(async ({ parsedInput: { email } }) => {
		const supabase = await createClient();

		await supabase.auth.signInWithOtp({ email });
	});
