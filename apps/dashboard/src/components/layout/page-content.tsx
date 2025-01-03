import { cn } from "@polaris/ui/cn";
import { Icons } from "@polaris/ui/icons";
import { SidebarTrigger } from "@polaris/ui/sidebar";
import Link from "next/link";
import type { PropsWithChildren, ReactNode } from "react";
import { MaxWidthWrapper } from "./max-width-wrapper";

interface PageContentProps extends PropsWithChildren {
	title?: ReactNode;
	description?: ReactNode;
	titleControls?: ReactNode;
}

export function PageContent({
	children,
	title,
	description,
	titleControls,
}: PageContentProps) {
	const hasTitle = title !== undefined;
	const hasDescription = description !== undefined;

	return (
		<div className="bg-muted md:bg-white">
			<MaxWidthWrapper
				className={cn(
					"mt-3",
					(hasTitle || hasDescription) && "md:mt-6 md:py-3",
				)}
			>
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<SidebarTrigger className="md:hidden" />
						{(hasTitle || hasDescription) && (
							<div>
								{hasTitle && (
									<div className="flex items-center gap-2">
										<h1 className="text-xl font-semibold leading-7 text-foreground tracking-tight md:text-2xl">
											{title}
										</h1>
									</div>
								)}
								{hasDescription && (
									<p className="mt-1 hidden text-base text-muted-foreground md:block">
										{description}
									</p>
								)}
							</div>
						)}
					</div>
					{titleControls && (
						<div className="hidden md:block">{titleControls}</div>
					)}
				</div>
			</MaxWidthWrapper>
			<div className="bg-white pt-2.5 max-md:mt-3 max-md:rounded-t-[16px]">
				{hasDescription && (
					<MaxWidthWrapper className="">
						<p className="mb-3 mt-1 text-base text-muted-foreground md:hidden">
							{description}
						</p>
					</MaxWidthWrapper>
				)}
				{children}
			</div>
		</div>
	);
}
