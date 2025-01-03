import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { getJournals, getProfile } from "@polaris/supabase/cached-queries";
import { cn } from "@polaris/ui/cn";
import { SidebarInset, SidebarProvider } from "@polaris/ui/sidebar";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
	const [profile, journals] = await Promise.all([getProfile(), getJournals()]);

	if (!profile?.data?.journal_id) {
		redirect("/journals");
	}

	return (
		<SidebarProvider>
			<AppSidebar profile={profile} journals={journals} />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
