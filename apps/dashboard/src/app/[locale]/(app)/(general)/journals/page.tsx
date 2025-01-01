import { JournalsList } from "@/components/journals-list";
import { getProfile } from "@polaris/supabase/cached-queries";
import { getJournalsQuery } from "@polaris/supabase/queries";
import { createClient } from "@polaris/supabase/server";
import { Button } from "@polaris/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function JournalsPage() {
	const supabase = await createClient();
	const profile = await getProfile();

	if (!profile?.data) {
		redirect("/");
	}

	const journals = await getJournalsQuery(supabase, profile?.data.id);

	if (journals.data?.length === 0) {
		redirect("/journals/create");
	}

	return (
		<div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
			<div className="relative z-20 m-auto flex w-full max-w-[480px] flex-col">
				<h1 className="text-2xl font-medium pb-2">Welcome back</h1>
				<p className="text-sm text-[#878787] mb-8">
					Select a journal or create a new one.
				</p>
				<JournalsList journals={journals} />
				<div className="text-center mt-8 border-t-[1px] border-border pt-6">
					<Link href="/journals/create">
						<Button className="w-full" variant="ghost">
							Create Journal
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
