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

	const activeJournal = React.useMemo(() => {
		return journals?.data?.find(
			(journal) => journal.id === profile?.data?.journal_id,
		);
	}, [profile?.data?.journal_id, journals?.data]);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent group data-[state=open]:text-foreground px-1.5 hover:bg-sidebar-accent transition-all duration-150"
						>
							<JournalLogo
								className="h-8 w-8 rounded"
								name={activeJournal?.name ?? ""}
								logoUrl={activeJournal?.logo_url}
							/>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{activeJournal?.name}
								</span>
								<span className="truncate text-xs">{activeJournal?.role}</span>
							</div>
							<ChevronsUpDown className="ml-auto text-muted-foreground group-hover:text-foreground" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] rounded-lg shadow-sm"
						align="center"
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
