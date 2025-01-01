"use client";

import { ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

import { changeJournalAction } from "@/actions/journals/change-journal-action";
import { JournalLogo } from "@/components/journal-logo";
import type { getJournals, getProfile } from "@polaris/supabase/cached-queries";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@polaris/ui/dropdown-menu";
import { Icons } from "@polaris/ui/icons";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@polaris/ui/sidebar";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";

export interface JournalSwitcherProps {
	profile: Awaited<ReturnType<typeof getProfile>>;
	journals: Awaited<ReturnType<typeof getJournals>>;
}

export function JournalSwitcher({ profile, journals }: JournalSwitcherProps) {
	const changeJournal = useAction(changeJournalAction);
	const { isMobile } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground px-1.5">
							<JournalLogo
								className="h-6 w-6 rounded"
								name={profile?.data?.journal?.name ?? ""}
								logoUrl={profile?.data?.journal?.logo_url}
							/>

							<div className="grid flex-1 text-left text-sm leading-tight truncate font-medium">
								<span className="truncate">{profile?.data?.journal?.name}</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-60 rounded-lg -ml-1 shadow-sm"
						align="start"
						side="bottom"
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							Journals
						</DropdownMenuLabel>
						{journals?.data?.map((journal, index) => (
							<DropdownMenuItem
								key={journal.name}
								onClick={() => changeJournal.execute({ journalId: journal.id })}
								className="gap-2 p-2"
								disabled={changeJournal.status === "executing"}
							>
								<JournalLogo
									name={journal.name}
									logoUrl={journal.logo_url}
									className="h-6 w-6"
								/>
								{journal.name}
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<Link href="/journals">
							<DropdownMenuItem className="gap-2 p-2">
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<Icons.RectangleStackIcon className="size-4" />
								</div>
								<div className="font-medium text-muted-foreground">
									All journals
								</div>
							</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
