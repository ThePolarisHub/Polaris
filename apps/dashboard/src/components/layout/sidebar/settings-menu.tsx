import { Icons } from "@polaris/ui/icons";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@polaris/ui/sidebar";
import Link from "next/link";

interface MenuItem {
	title: string;
	url: string;
	icon: React.JSX.Element;
	isActive?: boolean;
}

const account: MenuItem[] = [
	{
		title: "Preferences",
		url: "/",
		icon: <Icons.AdjustmentHorizontalIcon />,
	},
	{
		title: "Profile",
		url: "/",
		icon: <Icons.UserCircleIcon />,
	},
	{
		title: "Notifications",
		url: "/",
		icon: <Icons.BellIcon />,
	},
	{
		title: "Security & Access",
		url: "/",
		icon: <Icons.KeyIcon />,
	},
];

const journal: MenuItem[] = [
	{
		title: "General",
		url: "/",
		icon: <Icons.CogIcon />,
	},
	{
		title: "Members",
		url: "/",
		icon: <Icons.UsersGroupIcon />,
	},
	{
		title: "Import history",
		url: "/",
		icon: <Icons.FolderPlusIcon />,
	},
	{
		title: "Billing",
		url: "/",
		icon: <Icons.CreditCardIcon />,
	},
];

export function SidebarSettingsMenu() {
	return (
		<>
			<SidebarGroup>
				<SidebarGroupLabel>Account</SidebarGroupLabel>
				<SidebarMenu>
					{account.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild isActive={item.isActive}>
								<Link href={item.url}>
									{item.icon}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroup>
			<SidebarGroup>
				<SidebarGroupLabel>Journal</SidebarGroupLabel>
				<SidebarMenu>
					{journal.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild isActive={item.isActive}>
								<Link href={item.url}>
									{item.icon}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroup>
		</>
	);
}
