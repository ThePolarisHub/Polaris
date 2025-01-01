"use client";

import type * as React from "react";

import {
	JournalSwitcher,
	type JournalSwitcherProps,
} from "@/components/layout/sidebar/journal-switcher";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import { Icons } from "@polaris/ui/icons";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@polaris/ui/sidebar";

// This is sample data.
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: Icons.CloseIcon,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: Icons.CloseIcon,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Icons.CloseIcon,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Playground",
			url: "#",
			icon: Icons.CloseIcon,
			isActive: true,
			items: [
				{
					title: "History",
					url: "#",
				},
				{
					title: "Starred",
					url: "#",
				},
				{
					title: "Settings",
					url: "#",
				},
			],
		},
		{
			title: "Models",
			url: "#",
			icon: Icons.CloseIcon,
			items: [
				{
					title: "Genesis",
					url: "#",
				},
				{
					title: "Explorer",
					url: "#",
				},
				{
					title: "Quantum",
					url: "#",
				},
			],
		},
		{
			title: "Documentation",
			url: "#",
			icon: Icons.CloseIcon,
			items: [
				{
					title: "Introduction",
					url: "#",
				},
				{
					title: "Get Started",
					url: "#",
				},
				{
					title: "Tutorials",
					url: "#",
				},
				{
					title: "Changelog",
					url: "#",
				},
			],
		},
		{
			title: "Settings",
			url: "#",
			icon: Icons.CloseIcon,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Icons.CloseIcon,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: Icons.CloseIcon,
		},
		{
			name: "Travel",
			url: "#",
			icon: Icons.CloseIcon,
		},
	],
};

interface AppSidebarProps
	extends React.ComponentProps<typeof Sidebar>,
		JournalSwitcherProps {}

export function AppSidebar(props: AppSidebarProps) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="flex items-center flex-row justify-between pt-4">
				<div>
					<JournalSwitcher {...props} />
				</div>
				<div>
					<NavUser {...props} />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarMenu>
						{data.projects.map((item) => (
							<SidebarMenuItem key={item.name}>
								<SidebarMenuButton asChild>
									<a href={item.url}>
										<Icons.CloseIcon />
										<span>{item.name}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				<SidebarGroup className="mt-auto">
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<a href="/">
										<Icons.BuoyIcon />
										<span>Support</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<a href="/">
										<Icons.MegaphoneIcon />
										<span>Feedback</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
