import { AVATAR_ACCEPTED_IMAGE_TYPES } from "@/utils/configuration";
import { AVATAR_MAX_FILE_SIZE } from "@/utils/configuration";
import { z } from "zod";

export const requestOtpCodeSchema = z.object({
	email: z.string().email({
		message:
			"Hmm, that email doesn't look quite right. Mind double-checking it?",
	}),
});

export const verifyOtpCodeSchema = z.object({
	email: z.string().email({
		message:
			"Hmm, that email doesn't look quite right. Mind double-checking it?",
	}),
	token: z.string().length(6, {
		message:
			"The verification code should be 6 digits long. Please check and try again.",
	}),
});

export const updateProfileSchema = z.object({
	display_name: z
		.string()
		.min(
			3,
			"Your display name needs to be at least 3 characters long - add a few more!",
		)
		.max(
			32,
			"Whoa there! Could you make your display name a bit shorter? 32 characters is our limit.",
		),
	avatar: z
		.custom<File>()
		.refine(
			(file) => !file || file.size <= AVATAR_MAX_FILE_SIZE,
			"This image is a bit too large for us to handle. Could you try one under 5MB?",
		)
		.refine(
			(file) => !file || AVATAR_ACCEPTED_IMAGE_TYPES.includes(file.type),
			"We can only accept JPG, PNG or SVG images at the moment. Mind trying one of those formats?",
		)
		.optional(),
});
