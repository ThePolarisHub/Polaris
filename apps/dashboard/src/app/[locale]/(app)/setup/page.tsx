import { SetupProfileForm } from "@/components/setup-profile-form";
import { Icons } from "@polaris/ui/icons";
import Link from "next/link";

export default function SetupPage() {
	return (
		<div>
			<header className="w-full fixed left-0 right-0">
				<div className="ml-5 mt-4 md:ml-10 md:mt-10">
					<Link href="/" className="flex items-center gap-3">
						<Icons.PolarisLogoIcon className="w-6 h-6" />
						<span className="tracking-wide">polaris</span>
					</Link>
				</div>
			</header>

			<div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
				<div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
					<h1 className="text-2xl font-medium pb-2">Setup your profile</h1>
					<p className="text-sm text-[#878787] mb-8">
						Set your display name and an optional avatar.
					</p>
					<SetupProfileForm />
				</div>
			</div>
		</div>
	);
}
