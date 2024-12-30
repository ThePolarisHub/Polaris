import { Icons } from "@polaris/ui/icons";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="h-screen flex flex-col items-center justify-center text-center text-sm text-[#606060]">
			<Icons.PolarisLogoIcon className="w-16 h-16 mb-10" />
			<h2 className="text-xl font-semibold mb-2">Not Found</h2>
			<p className="mb-4">Could not find requested resource</p>
			<Link href="/" className="underline">
				Return Home
			</Link>
		</div>
	);
}
