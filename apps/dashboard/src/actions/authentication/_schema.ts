import { z } from "zod";

export const requestOtpCodeSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
});

export const verifyOtpCodeSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
	token: z
		.string()
		.length(6, { message: "Please enter a valid verification code" }),
});
