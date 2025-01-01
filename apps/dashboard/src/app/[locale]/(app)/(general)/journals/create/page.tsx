import { CreateJournalForm } from "@/components/forms/create-journal-form";

export default async function CreateTeamPage() {
	return (
		<div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
			<div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
				<h1 className="text-2xl font-medium pb-2">
					What’s the name of your journal?
				</h1>
				<p className="text-sm text-[#878787] mb-8">
					Create a space for your trades. Choose a name that reflects your
					trading strategy or portfolio focus.
				</p>
				<CreateJournalForm />
			</div>
		</div>
	);
}
