"use server";

import { createClient } from "@polaris/supabase/server";
import { actionClient } from "../safe-action";
import { requestOtpCodeSchema } from "./_schema";

export const requestOtpCodeAction = actionClient
	.schema(requestOtpCodeSchema)
	.action(async ({ parsedInput: { email } }) => {
		if (!email) {
			throw new Error("Email is required");
		}

		const supabase = await createClient();

		const { error } = await supabase.auth.signInWithOtp({ email });

		if (error) {
			console.log(error);
			switch (error.code) {
				case "email_address_not_authorized":
					throw new Error(
						"Email sending is not allowed for this address. Please contact support.",
					);
				case "email_address_invalid":
					throw new Error(
						"Invalid email address. Please use a different email.",
					);
				case "over_email_send_rate_limit":
					throw new Error(
						"Too many emails sent. Please wait a while before trying again.",
					);
				case "over_request_rate_limit":
					throw new Error(
						"Too many requests. Please try again in a few minutes.",
					);
				case "email_provider_disabled":
					throw new Error("Email sign-in is currently disabled.");
				case "signup_disabled":
					throw new Error("Sign ups are currently disabled.");
				default:
					throw new Error(
						"Failed to send verification code. Please try again.",
					);
			}
		}
	});
