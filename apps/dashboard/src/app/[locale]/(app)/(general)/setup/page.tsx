import { SetupProfileForm } from "@/components/forms/setup-profile-form";
import { getProfile } from "@polaris/supabase/cached-queries";

export default async function SetupProfilePage() {
	const profile = await getProfile();

	return (
		<div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
			<div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
				<h1 className="text-2xl font-medium pb-2">Setup your profile</h1>
				<p className="text-sm text-[#878787] mb-8">
					Set your display name and an optional avatar.
				</p>
				<SetupProfileForm profile={profile} />
			</div>
		</div>
	);
}
