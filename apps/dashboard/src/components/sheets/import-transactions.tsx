import { Button } from "@polaris/ui/button";
import { Icons } from "@polaris/ui/icons";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@polaris/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@polaris/ui/tooltip";

function ImportButton() {
	return (
		<div>
			<Button
				variant="outline"
				size="icon"
				tooltip="Import trades"
				className="shadow-none h-10 w-10"
			>
				<Icons.ArrowDownTrayIcon />
			</Button>
		</div>
	);
}

export function ImportTransactionsSheet() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				{/* Little hack, without div the sheet and tooltip don't work */}
				<div>
					<Button
						variant="outline"
						size="icon"
						tooltip="Import trades"
						className="shadow-none "
					>
						<Icons.ArrowDownTrayIcon />
					</Button>
				</div>
			</SheetTrigger>
			<SheetContent className="w-[400px] min-w-[400px] max-w-[400px] sm:min-w-[580px] sm:max-w-[580px] sm:w-[580px]">
				<SheetHeader>
					<SheetTitle>Import Trades from CSV</SheetTitle>
					<SheetDescription>
						Upload a CSV file exported from your broker to import your trades.
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
