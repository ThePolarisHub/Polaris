import type { FileOptions } from "@supabase/storage-js";
import type { Client } from "../types";

export async function upload(
	supabase: Client,
	params: {
		bucket: string;
		path: string[];
		file: File;
		fileOptions?: FileOptions;
	},
) {
	const storage = supabase.storage.from(params.bucket);

	const result = await storage.upload(params.path.join("/"), params.file, {
		upsert: true,
		cacheControl: "3600",
		...params.fileOptions,
	});

	if (!result.error) {
		return storage.getPublicUrl(params.path.join("/")).data.publicUrl;
	}

	throw result.error;
}

export async function remove(
	supabase: Client,
	params: { bucket: string; path: string[] },
) {
	return supabase.storage
		.from(params.bucket)
		.remove([decodeURIComponent(params.path.join("/"))]);
}
