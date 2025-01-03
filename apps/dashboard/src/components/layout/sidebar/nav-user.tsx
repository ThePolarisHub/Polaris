"use client";

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";

import { signOutAction } from "@/actions/authentication/sign-out-action";
import { ProfileAvatar } from "@/components/profile-avatar";
import type { getProfile } from "@polaris/supabase/cached-queries";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
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

interface NavUserProps {
	profile: Awaited<ReturnType<typeof getProfile>>;
}

export function NavUser({ profile }: NavUserProps) {
	const signOut = useAction(signOutAction);
	const { isMobile } = useSidebar();

	function handleSignOut() {
		signOut.execute();
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-foreground rounded-full p-0 px-0.5 hover:bg-transparent">
							<ProfileAvatar
								className="h-7 w-7 rounded-full hover:border-foreground/20 transition-all duration-200 hover:ring-4 hover:ring-ring/20 border-foreground/20"
								name={profile?.data?.display_name ?? ""}
								avatarUrl={profile?.data?.avatar_url}
							/>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg mt-4 shadow-sm"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<ProfileAvatar
									className="h-9 w-9"
									name={profile?.data?.display_name ?? ""}
									avatarUrl={profile?.data?.avatar_url}
								/>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{profile?.data?.display_name}
									</span>
									<span className="truncate text-xs">
										{profile?.data?.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem disabled={signOut.status === "executing"}>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem disabled={signOut.status === "executing"}>
								<BadgeCheck />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem disabled={signOut.status === "executing"}>
								<CreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem disabled={signOut.status === "executing"}>
								<Bell />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleSignOut}
							disabled={signOut.status === "executing"}
						>
							<LogOut />
							Log out
							{signOut.status === "executing" && (
								<Icons.SpinnerIcon className="size-4 animate-spin mx-auto mr-0" />
							)}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
