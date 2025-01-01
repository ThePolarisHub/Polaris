import { cn } from "@polaris/ui/cn";
import type { HTMLAttributes } from "react";

export function MaxWidthWrapper({
	className,
	children,
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("mx-auto w-full max-w-screen-xl px-3 lg:px-10", className)}
		>
			{children}
		</div>
	);
}
