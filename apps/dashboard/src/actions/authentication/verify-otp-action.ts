"use server";

import { createClient } from "@polaris/supabase/server";
import { redirect } from "next/navigation";
import { actionClient } from "../safe-action";
import { verifyOtpCodeSchema } from "./_schema";

export const verifyOtpCodeAction = actionClient
	.schema(verifyOtpCodeSchema)
	.action(async ({ parsedInput: { email, token } }) => {
		if (!email || !token) {
			throw new Error("Email and OTP are required");
		}

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
						"Verification code has expired. Please request a new one.",
					);
				case "otp_disabled":
					throw new Error("Email verification is currently disabled.");
				case "over_request_rate_limit":
					throw new Error(
						"Too many attempts. Please try again in a few minutes.",
					);
				case "invalid_otp":
					throw new Error("Invalid verification code. Please try again.");
				default:
					throw new Error(
						"Failed to verify verification code. Please try again.",
					);
			}
		}

		redirect("/");
	});
