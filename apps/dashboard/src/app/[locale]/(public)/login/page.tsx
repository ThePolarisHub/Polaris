import { LoginForm } from "@/components/forms/otp-login-form";
import { Icons } from "@polaris/ui/icons";
import Link from "next/link";

export default function LoginPage() {
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
				<div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
					<div className="flex w-full flex-col relative">
						<h1 className="font-medium text-foreground pb-5 text-3xl">
							Login to polaris.
						</h1>

						<p className="font-medium pb-1 text-2xl text-[#878787]">
							Transform your trading journey <br />
							with powerful analytics and <br />
							insights designed for <br />
							peak results.
						</p>

						<div className="pointer-events-auto mt-6 flex flex-col mb-6">
							<LoginForm />
						</div>

						<p className="text-xs text-[#878787]">
							By clicking continue, you acknowledge that you have read and agree
							to the Polaris{" "}
							<a href="https://midday.ai/terms" className="underline">
								Terms of Service
							</a>{" "}
							and{" "}
							<a href="https://midday.ai/policy" className="underline">
								Privacy Policy
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
