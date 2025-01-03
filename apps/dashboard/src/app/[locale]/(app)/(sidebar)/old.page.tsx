import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { PageContent } from "@/components/layout/page-content";
import { ImportTransactionsSheet } from "@/components/sheets/import-transactions";
import { TradesTable } from "@/components/tables/trades";
import { Button } from "@polaris/ui/button";
import { Icons } from "@polaris/ui/icons";
import { Input } from "@polaris/ui/input";

export default function Homepage() {
	return (
		<PageContent title="Homepage" description="Welcome to your dashboard">
			<div className="flex w-full items-center pt-3">
				<MaxWidthWrapper className="flex flex-col gap-y-3">
					<div className="flex flex-wrap items-center justify-between gap-2 lg:flex-nowrap">
						<div className="flex w-full grow gap-2 md:w-auto">
							<div className="grow basis-0 md:grow-0">
								<Button variant="outline" size="lg" className="shadow-none">
									<Icons.FunnelIcon />
									Filter
									<Icons.ChevronDownIcon
										className="text-muted-foreground"
										strokeWidth={2}
									/>
								</Button>
							</div>
							<div className="grow basis-0 md:grow-0">
								<Button variant="outline" size="lg" className="shadow-none">
									<Icons.AdjustmentHorizontalIcon />
									Display
									<Icons.ChevronDownIcon />
								</Button>
							</div>
						</div>
						<div className="flex gap-x-2 max-md:w-full">
							<div className="w-full md:w-56 lg:w-64">
								<Input placeholder="Search" className="shadow-none h-10 px-4" />
							</div>
							<div className="grow-0">
								<Button size="lg" className="shadow-none">
									Create trade
								</Button>
							</div>
							<ImportTransactionsSheet />
						</div>
					</div>
				</MaxWidthWrapper>
			</div>
			<MaxWidthWrapper className="mx-auto py-6 pb-20">
				<TradesTable />
			</MaxWidthWrapper>
		</PageContent>
	);
}
