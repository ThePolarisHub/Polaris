import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { PageContent } from "@/components/layout/page-content";

export default function SettingsPage() {
	return (
		<PageContent title="Settings">
			<MaxWidthWrapper>
				<div className="flex flex-1 flex-col gap-4">
					<div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<div className="aspect-video rounded-xl bg-muted/50" />
						<div className="aspect-video rounded-xl bg-muted/50" />
						<div className="aspect-video rounded-xl bg-muted/50" />
					</div>
					<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
				</div>
			</MaxWidthWrapper>
		</PageContent>
	);
}