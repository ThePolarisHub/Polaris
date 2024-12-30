import { updateSession } from "@polaris/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const response = await updateSession(req);

	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|api|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
