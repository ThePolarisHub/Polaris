import { cn } from "@polaris/ui/cn";
import { Icons } from "@polaris/ui/icons";
import { SidebarTrigger } from "@polaris/ui/sidebar";
import Link from "next/link";
import type { PropsWithChildren, ReactNode } from "react";
import { MaxWidthWrapper } from "./max-width-wrapper";

interface PageContentProps extends PropsWithChildren {
	title?: ReactNode;
	titleBackButtonLink?: string;
	description?: ReactNode;
	titleControls?: ReactNode;
}

export function PageContent({
	children,
	title,
	description,
	titleBackButtonLink,
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
										{titleBackButtonLink && (
											<Link
												href={titleBackButtonLink}
												className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
											>
												<Icons.ChevronLeftIcon className="size-5" />
											</Link>
										)}
										<h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
											{title}
										</h1>
									</div>
								)}
								{hasDescription && (
									<p className="mt-1 hidden text-base text-neutral-500 md:block">
										{description}
									</p>
								)}
							</div>
						)}
					</div>
					{titleControls && (
						<div className="hidden md:block">{titleControls}</div>
					)}
					{/* <div className="flex items-center gap-4 md:hidden">
							{!hideReferButton && <ReferButton />}
							<HelpButtonRSC />
							<UserDropdown />
						</div> */}
				</div>
			</MaxWidthWrapper>
			<div className="bg-white pt-2.5 max-md:mt-3 max-md:rounded-t-[16px]">
				{hasDescription && (
					<MaxWidthWrapper className="">
						<p className="mb-3 mt-1 text-base text-neutral-500 md:hidden">
							{description}
						</p>
					</MaxWidthWrapper>
				)}
				{children}
			</div>
		</div>
	);
}
