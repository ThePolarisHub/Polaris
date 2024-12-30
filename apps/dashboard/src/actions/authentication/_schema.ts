import { AVATAR_ACCEPTED_IMAGE_TYPES } from "@/utils/configuration";
import { AVATAR_MAX_FILE_SIZE } from "@/utils/configuration";
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

export const updateProfileSchema = z.object({
	display_name: z
		.string()
		.min(3, "Display name must be at least 3 characters")
		.max(32, "Display name cannot be longer than 32 characters"),
	avatar: z
		.custom<File>()
		.refine(
			(file) => !file || file.size <= AVATAR_MAX_FILE_SIZE,
			"The image file is too large. Please choose an image under 5MB",
		)
		.refine(
			(file) => !file || AVATAR_ACCEPTED_IMAGE_TYPES.includes(file.type),
			"This file type is not supported. Please use JPG, PNG or WebP images only",
		)
		.optional(),
});
