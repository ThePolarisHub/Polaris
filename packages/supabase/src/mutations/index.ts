import type { Client, TablesUpdate } from "../types";

export async function updateProfile(
	supabase: Client,
	profile: TablesUpdate<"profiles">,
) {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		throw new Error("User not authenticated");
	}

	return await supabase
		.from("profiles")
		.update(profile)
		.eq("id", session.user.id)
		.select()
		.single();
}
