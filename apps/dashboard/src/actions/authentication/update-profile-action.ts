"use server";

import { stripSpecialCharacters } from "@/utils";
import { updateProfile } from "@polaris/supabase/mutations";
import { remove, upload } from "@polaris/supabase/storage";
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
			await supabase.auth.updateUser({ data: { display_name } });

			if (avatar) {
				const filename = stripSpecialCharacters(avatar.name);
				const avatarUrl = await upload(supabase, {
					bucket: "profiles",
					path: [profile.id, filename],
					file: avatar,
				});

				const previousAvatarFile = profile.avatar_url?.split("/").pop() ?? "";
				await remove(supabase, {
					bucket: "profiles",
					path: [profile.id, previousAvatarFile],
				});

				await updateProfile(supabase, { avatar_url: avatarUrl });
			}

			revalidateTag(`profile_${profile.id}`);

			redirect("/");
		},
	);
