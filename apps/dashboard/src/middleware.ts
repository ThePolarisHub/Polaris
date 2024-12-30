import { updateSession } from "@polaris/supabase/middleware";
import { createI18nMiddleware } from "next-international/dist/app/middleware";
import type { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
	locales: ["en"],
	defaultLocale: "en",
	urlMappingStrategy: "rewrite",
});

export async function middleware(request: NextRequest) {
	const response = await updateSession(request, I18nMiddleware(request));

	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|api|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
