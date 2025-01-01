import { getSession } from "@polaris/supabase/cached-queries";
import { createClient } from "@polaris/supabase/server";
import { Icons } from "@polaris/ui/icons";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export default async function FormPageLayout({ children }: PropsWithChildren) {
	const supabase = await createClient();

	const {
		data: { session },
	} = await getSession();

	async function signOut() {
		await supabase.auth.signOut();
	}

	return (
		<div>
			<header className="w-full fixed flex justify-between items-center left-0 right-0 px-5 py-4 md:px-10 md:py-10">
				<Link href="/" className="flex items-center gap-3">
					<Icons.PolarisLogoIcon className="w-6 h-6" />
					<span className="tracking-wide">polaris</span>
				</Link>
			</header>
			{children}
		</div>
	);
}
