"use server";

import { createClient } from "@polaris/supabase/server";
import { actionClient } from "../safe-action";
import { requestOtpCodeSchema } from "./_schema";

export const requestOtpCodeAction = actionClient
	.schema(requestOtpCodeSchema)
	.action(async ({ parsedInput: { email } }) => {
		const supabase = await createClient();

		const { error } = await supabase.auth.signInWithOtp({ email });

		if (error) {
			console.log(error);
			switch (error.code) {
				case "email_address_not_authorized":
					throw new Error(
						"We're unable to send emails to this address. Please reach out to our support team for assistance.",
					);
				case "email_address_invalid":
					throw new Error(
						"Hmm, that email address doesn't look quite right. Could you please double-check it?",
					);
				case "over_email_send_rate_limit":
					throw new Error(
						"We've sent quite a few emails already. Please wait a few minutes before requesting another code.",
					);
				case "over_request_rate_limit":
					throw new Error(
						"Looks like you're trying this a bit too frequently. Please take a short break and try again in a few minutes.",
					);
				case "email_provider_disabled":
					throw new Error(
						"Sorry, email sign-in isn't available right now. Please try again later.",
					);
				case "signup_disabled":
					throw new Error(
						"We're not accepting new sign-ups at the moment. Please check back later.",
					);
				default:
					throw new Error(
						"Oops! We couldn't send your verification code. Please try again.",
					);
			}
		}
	});
