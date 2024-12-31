"use server";

import { createClient } from "@polaris/supabase/server";
import { redirect } from "next/navigation";
import { actionClient } from "../safe-action";
import { verifyOtpCodeSchema } from "./_schema";

export const verifyOtpCodeAction = actionClient
	.schema(verifyOtpCodeSchema)
	.action(async ({ parsedInput: { email, token } }) => {
		const supabase = await createClient();

		const { error } = await supabase.auth.verifyOtp({
			email,
			token,
			type: "email",
		});

		if (error) {
			switch (error.code) {
				case "otp_expired":
					throw new Error(
						"Looks like this verification code has expired. No worries - just request a new one and we'll get you sorted.",
					);
				case "otp_disabled":
					throw new Error(
						"Sorry, email verification is temporarily unavailable. Please try again later or contact support if this persists.",
					);
				case "over_request_rate_limit":
					throw new Error(
						"Whoa there! You've tried quite a few times. Let's take a quick break - try again in a few minutes.",
					);
				case "invalid_otp":
					throw new Error(
						"That verification code doesn't seem right. Double-check the numbers and try entering it again.",
					);
				default:
					throw new Error(
						"Something went wrong while verifying your code. Give it another try, or request a new code if needed.",
					);
			}
		}

		redirect("/");
	});
