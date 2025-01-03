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

const items: MenuItem[] = [
	{
		title: "Dashboard",
		url: "/",
		icon: <Icons.HomeIcon />,
	},
	{
		title: "Analytics",
		url: "/",
		icon: <Icons.LineChartIcon />,
	},
	{
		title: "Settings",
		url: "/settings",
		icon: <Icons.CogIcon />,
	},
];

export function SidebarDefaultMenu() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Navigation</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
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
	);
}
