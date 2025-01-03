"use client";

import type * as React from "react";

import {
	JournalSwitcher,
	type JournalSwitcherProps,
} from "@/components/layout/sidebar/journal-switcher";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import { Button } from "@polaris/ui/button";
import { cn } from "@polaris/ui/cn";
import { Icons } from "@polaris/ui/icons";
import { Sidebar, SidebarContent, SidebarHeader } from "@polaris/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { SidebarDefaultMenu } from "./default-menu";
import { SidebarFooterMenu } from "./footer-menu";
import { SidebarSettingsMenu } from "./settings-menu";

interface AppSidebarProps
	extends React.ComponentProps<typeof Sidebar>,
		JournalSwitcherProps {}

function Area({
	children,
	visible,
	direction,
}: React.PropsWithChildren<{ visible: boolean; direction: "left" | "right" }>) {
	return (
		<div
			className={cn(
				"left-0 top-0 flex size-full flex-col md:transition-[opacity,transform] md:duration-300",
				visible
					? "opacity-100 relative"
					: cn(
							"pointer-events-none absolute opacity-0",
							direction === "left" ? "-translate-x-full" : "translate-x-full",
						),
			)}
			aria-hidden={!visible ? "true" : undefined}
			inert={!visible ? true : undefined}
		>
			{children}
		</div>
	);
}

export function AppSidebar(props: AppSidebarProps) {
	const pathname = usePathname();

	const currentArea = useMemo(() => {
		return pathname.startsWith("/settings") ? "settings" : "dashboard";
	}, [pathname]);

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<div className="flex items-center flex-row justify-between">
					<div className="relative">
						<div
							className={cn(
								"absolute inset-0 transition-opacity duration-200",
								currentArea === "settings"
									? "opacity-100"
									: "opacity-0 pointer-events-none",
							)}
						>
							<Link href="/">
								<Button
									variant="ghost"
									size="sm"
									className="px-1.5 text-foreground hover:bg-transparent"
								>
									<Icons.ChevronLeftIcon
										className="max-w-3 max-h-3 text-foreground"
										strokeWidth={2.5}
									/>
									<span className="text-sm">Settings</span>
								</Button>
							</Link>
						</div>
						<div
							className={cn(
								"transition-opacity duration-200",
								currentArea === "settings"
									? "opacity-0 pointer-events-none"
									: "opacity-100",
							)}
						>
							<Link href="/">
								<Button
									variant="ghost"
									size="sm"
									className="px-1.5 text-foreground hover:bg-transparent font-bold"
								>
									<span className="text-lg">Polaris</span>
								</Button>
							</Link>
						</div>
					</div>
					<div>
						<NavUser {...props} />
					</div>
				</div>
				<div>
					<JournalSwitcher {...props} />
				</div>
			</SidebarHeader>
			<SidebarContent className="relative w-full">
				<Area visible={currentArea === "dashboard"} direction="left">
					<SidebarDefaultMenu />
				</Area>
				<Area visible={currentArea === "settings"} direction="right">
					<SidebarSettingsMenu />
				</Area>
				<SidebarFooterMenu />
			</SidebarContent>
		</Sidebar>
	);
}
