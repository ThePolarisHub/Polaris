"use server";

import { stripSpecialCharacters } from "@/utils";
import { updateProfile } from "@polaris/supabase/mutations";
import { remove, upload } from "@polaris/supabase/storage";
import type { Client, StorageError } from "@polaris/supabase/types";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "../safe-action";
import { updateProfileSchema } from "./_schema";

export const updateProfileAction = authActionClient
	.schema(updateProfileSchema)
	.action(
		async ({
			parsedInput: { display_name, avatar },
			ctx: { supabase, profile },
		}) => {
			// We set the avatarUrl to the current avatar_url
			let avatarUrl = profile.avatar_url;

			// If avatar is provided, upload it to the storage bucket and set the avatar_url to the new url
			if (avatar) {
				const filename = stripSpecialCharacters(avatar.name);
				try {
					avatarUrl = await upload(supabase, {
						bucket: "avatars",
						path: [profile.id, filename],
						file: avatar,
					});
					// Remove the previous avatar if it exists
					const previousAvatarName = profile.avatar_url?.split("/").pop();
					if (previousAvatarName) {
						await remove(supabase, {
							bucket: "avatars",
							path: [profile.id, previousAvatarName],
						});
					}
				} catch (e) {
					const error = e as StorageError;
					// @ts-expect-error - TODO: Supabase types are not up to date
					switch (error.statusCode) {
						case 400: // Bad request
							throw new Error(
								"Sorry, there was an issue with the file format. Please try uploading a different image.",
							);
						case 401: // Invalid JWT
							throw new Error(
								"Your session has expired. Please sign in again to upload your avatar.",
							);
						case 403: // Access denied or signature mismatch
							throw new Error(
								"You don't have permission to upload files. Please contact support if this persists.",
							);
						case 404: // Bucket/resource not found
							throw new Error(
								"The avatar storage location is not available. Please try again later.",
							);
						case 411: // Missing content length
							throw new Error(
								"The image file appears to be corrupted. Please try uploading a different image.",
							);
						case 413: // Entity too large
							throw new Error(
								"The image file is too large. Please choose a smaller image under 5MB.",
							);
						case 423: // Resource locked
							throw new Error(
								"The avatar storage is temporarily locked. Please try again in a few moments.",
							);
						case 500: // Internal/database error
							throw new Error(
								"We're having issues with our storage service. Please try again later.",
							);
						case 503: // Service unavailable
							throw new Error(
								"Our storage service is temporarily down. Please try again in a few minutes.",
							);
						case 504: // Gateway timeout
							throw new Error(
								"The upload took too long. Please try again with a smaller image or check your connection.",
							);
						default:
							throw new Error(
								"Sorry, we couldn't upload your avatar. Please try again later.",
							);
					}
				}
			}

			// Update the user's display name and avatar_url
			await supabase.auth.updateUser({ data: { display_name } });
			await updateProfile(supabase, { avatar_url: avatarUrl });

			// Revalidate the profile tag
			revalidateTag(`profile_${profile.id}`);

			// Redirect to the home page
			redirect("/");
		},
	);
