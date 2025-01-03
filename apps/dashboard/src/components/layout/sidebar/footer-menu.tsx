import { Icons } from "@polaris/ui/icons";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@polaris/ui/sidebar";

const items = [
	{
		title: "Support",
		url: "/",
		icon: <Icons.BuoyIcon />,
	},
	{
		title: "Feedback",
		url: "/",
		icon: <Icons.MegaphoneIcon />,
	},
];

export function SidebarFooterMenu() {
	return (
		<SidebarGroup className="mt-auto">
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild>
								<a href="/">
									{item.icon}
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
