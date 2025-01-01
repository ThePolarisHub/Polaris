"use server";

import { createClient } from "@polaris/supabase/server";
import { redirect } from "next/navigation";
import { actionClient } from "../safe-action";
import { verifyOtpCodeSchema } from "./_schema";

export const verifyOtpCodeAction = actionClient
	.schema(verifyOtpCodeSchema)
	.action(async ({ parsedInput: { email, token } }) => {
		const supabase = await createClient();

		await supabase.auth.verifyOtp({ email, token, type: "email" });

		redirect("/");
	});
