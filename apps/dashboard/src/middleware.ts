import { updateSession } from "@polaris/supabase/middleware";
import { createClient } from "@polaris/supabase/server";
import { createI18nMiddleware } from "next-international/dist/app/middleware";
import { type NextRequest, NextResponse } from "next/server";

const I18nMiddleware = createI18nMiddleware({
	locales: ["en"],
	defaultLocale: "en",
	urlMappingStrategy: "rewrite",
});

export async function middleware(request: NextRequest) {
	const response = await updateSession(request, I18nMiddleware(request));
	const supabase = await createClient();
	const url = new URL("/", request.url);
	const nextUrl = request.nextUrl;

	const pathnameLocale = nextUrl.pathname.split("/", 2)?.[1];

	// Remove the locale from the pathname
	const pathnameWithoutLocale = pathnameLocale
		? nextUrl.pathname.slice(pathnameLocale.length + 1)
		: nextUrl.pathname;

	// Create a new URL without the locale in the pathname
	const newUrl = new URL(pathnameWithoutLocale || "/", request.url);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Not authenticated
	if (!session && newUrl.pathname !== "/login") {
		const encodedSearchParams = `${newUrl.pathname.substring(1)}${
			newUrl.search
		}`;

		const url = new URL("/login", request.url);

		if (encodedSearchParams) {
			url.searchParams.append("return_to", encodedSearchParams);
		}

		return NextResponse.redirect(url);
	}

	// If authenticated but no display_name redirect to user setup page
	if (
		newUrl.pathname !== "/setup" &&
		newUrl.pathname !== "/journals/create" &&
		session &&
		!session?.user?.user_metadata?.display_name
	) {
		return NextResponse.redirect(`${url.origin}/setup`);
	}

	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|api|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
