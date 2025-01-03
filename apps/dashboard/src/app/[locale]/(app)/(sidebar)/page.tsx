import { ImportTransactionsSheet } from "@/components/sheets/import-transactions";
import { type Trade, columns } from "@/components/tables/dashboard/columns";
import { DataTable } from "@/components/tables/dashboard/data-table";
import { Button } from "@polaris/ui/button";
import { Icons } from "@polaris/ui/icons";
import { Input } from "@polaris/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@polaris/ui/toggle-group";

const trades: Trade[] = [
	{
		id: "1",
		symbol: "AAPL",
		type: "long",
		status: "won",
		entryPrice: 175.23,
		exitPrice: 178.45,
		pnl: 322.2,
		openedAt: "2024-01-15T09:30:00Z",
		closedAt: "2024-01-15T14:45:00Z",
		notes: "Strong momentum after earnings beat",
		position: 100,
		stopLoss: 172.5,
		takeProfit: 180.0,
		riskRewardRatio: 2.75,
		fees: 1.5,
		strategy: "Breakout",
		timeframe: "1H",
		setupQuality: 4,
		emotionalState: 5,
	},
	{
		id: "2",
		symbol: "TSLA",
		type: "short",
		status: "lost",
		entryPrice: 220.5,
		exitPrice: 225.3,
		pnl: -480.0,
		openedAt: "2024-01-16T10:15:00Z",
		closedAt: "2024-01-16T11:30:00Z",
		notes: "Failed breakdown at support",
		position: 100,
		stopLoss: 225.5,
		takeProfit: 210.5,
		riskRewardRatio: 2.0,
		fees: 2.0,
		strategy: "Support/Resistance",
		timeframe: "15m",
		setupQuality: 3,
		emotionalState: 4,
	},
	{
		id: "3",
		symbol: "NVDA",
		type: "long",
		status: "open",
		entryPrice: 480.75,
		exitPrice: null,
		pnl: null,
		openedAt: "2024-01-17T13:45:00Z",
		closedAt: null,
		notes: "AI sector momentum",
		position: 50,
		stopLoss: 470.0,
		takeProfit: 500.0,
		riskRewardRatio: 1.8,
		fees: 1.75,
		strategy: "Trend Following",
		timeframe: "4H",
		setupQuality: 5,
		emotionalState: 4,
	},
	{
		id: "4",
		symbol: "META",
		type: "long",
		status: "won",
		entryPrice: 350.25,
		exitPrice: 365.8,
		pnl: 775.5,
		openedAt: "2024-01-18T09:45:00Z",
		closedAt: "2024-01-19T15:30:00Z",
		notes: "Bullish engulfing pattern",
		position: 50,
		stopLoss: 345.0,
		takeProfit: 370.0,
		riskRewardRatio: 3.2,
		fees: 1.25,
		strategy: "Price Action",
		timeframe: "1D",
		setupQuality: 5,
		emotionalState: 5,
	},
	{
		id: "5",
		symbol: "AMD",
		type: "short",
		status: "breakeven",
		entryPrice: 145.3,
		exitPrice: 145.25,
		pnl: -2.5,
		openedAt: "2024-01-19T11:00:00Z",
		closedAt: "2024-01-19T15:45:00Z",
		notes: "Choppy market conditions",
		position: 75,
		stopLoss: 147.5,
		takeProfit: 140.0,
		riskRewardRatio: 2.1,
		fees: 1.5,
		strategy: "Mean Reversion",
		timeframe: "30m",
		setupQuality: 2,
		emotionalState: 3,
	},
	{
		id: "6",
		symbol: "MSFT",
		type: "long",
		status: "won",
		entryPrice: 390.45,
		exitPrice: 395.2,
		pnl: 475.0,
		openedAt: "2024-01-20T10:30:00Z",
		closedAt: "2024-01-20T14:15:00Z",
		notes: "Technical breakout",
		position: 100,
		stopLoss: 388.0,
		takeProfit: 396.0,
		riskRewardRatio: 2.2,
		fees: 2.0,
		strategy: "Breakout",
		timeframe: "1H",
		setupQuality: 4,
		emotionalState: 4,
	},
	{
		id: "7",
		symbol: "AMZN",
		type: "short",
		status: "lost",
		entryPrice: 155.75,
		exitPrice: 158.3,
		pnl: -255.0,
		openedAt: "2024-01-21T09:30:00Z",
		closedAt: "2024-01-21T10:45:00Z",
		notes: "Failed breakdown",
		position: 100,
		stopLoss: 158.5,
		takeProfit: 150.0,
		riskRewardRatio: 1.7,
		fees: 1.75,
		strategy: "Support/Resistance",
		timeframe: "15m",
		setupQuality: 2,
		emotionalState: 3,
	},
	{
		id: "8",
		symbol: "GOOGL",
		type: "long",
		status: "open",
		entryPrice: 142.8,
		exitPrice: null,
		pnl: null,
		openedAt: "2024-01-22T13:15:00Z",
		closedAt: null,
		notes: "Earnings play",
		position: 150,
		stopLoss: 140.0,
		takeProfit: 148.0,
		riskRewardRatio: 1.85,
		fees: 2.25,
		strategy: "Event Driven",
		timeframe: "4H",
		setupQuality: 3,
		emotionalState: 4,
	},
	{
		id: "9",
		symbol: "JPM",
		type: "long",
		status: "won",
		entryPrice: 172.4,
		exitPrice: 175.6,
		pnl: 320.0,
		openedAt: "2024-01-23T09:45:00Z",
		closedAt: "2024-01-23T15:30:00Z",
		notes: "Strong sector momentum",
		position: 100,
		stopLoss: 170.0,
		takeProfit: 176.0,
		riskRewardRatio: 1.5,
		fees: 1.5,
		strategy: "Trend Following",
		timeframe: "1D",
		setupQuality: 4,
		emotionalState: 5,
	},
	{
		id: "10",
		symbol: "BAC",
		type: "short",
		status: "won",
		entryPrice: 33.45,
		exitPrice: 32.2,
		pnl: 125.0,
		openedAt: "2024-01-24T10:00:00Z",
		closedAt: "2024-01-24T14:45:00Z",
		notes: "Bearish divergence",
		position: 100,
		stopLoss: 34.0,
		takeProfit: 32.0,
		riskRewardRatio: 2.3,
		fees: 1.25,
		strategy: "Technical",
		timeframe: "2H",
		setupQuality: 4,
		emotionalState: 4,
	},
	{
		id: "11",
		symbol: "NFLX",
		type: "long",
		status: "won",
		entryPrice: 485.3,
		exitPrice: 492.75,
		pnl: 745.0,
		openedAt: "2024-01-25T09:30:00Z",
		closedAt: "2024-01-25T16:00:00Z",
		notes: "Post-earnings momentum",
		position: 100,
		stopLoss: 480.0,
		takeProfit: 495.0,
		riskRewardRatio: 2.0,
		fees: 2.0,
		strategy: "Event Driven",
		timeframe: "1D",
		setupQuality: 5,
		emotionalState: 5,
	},
	{
		id: "12",
		symbol: "INTC",
		type: "short",
		status: "open",
		entryPrice: 48.75,
		exitPrice: null,
		pnl: null,
		openedAt: "2024-01-26T11:15:00Z",
		closedAt: null,
		notes: "Technical resistance",
		position: 200,
		stopLoss: 50.0,
		takeProfit: 46.0,
		riskRewardRatio: 1.75,
		fees: 2.5,
		strategy: "Technical",
		timeframe: "4H",
		setupQuality: 3,
		emotionalState: 4,
	},
	{
		id: "13",
		symbol: "DIS",
		type: "long",
		status: "lost",
		entryPrice: 95.4,
		exitPrice: 93.2,
		pnl: -220.0,
		openedAt: "2024-01-27T10:00:00Z",
		closedAt: "2024-01-27T15:30:00Z",
		notes: "Failed breakout attempt",
		position: 100,
		stopLoss: 93.0,
		takeProfit: 98.0,
		riskRewardRatio: 2.2,
		fees: 1.5,
		strategy: "Breakout",
		timeframe: "1H",
		setupQuality: 2,
		emotionalState: 3,
	},
	{
		id: "14",
		symbol: "PYPL",
		type: "short",
		status: "won",
		entryPrice: 62.8,
		exitPrice: 60.4,
		pnl: 240.0,
		openedAt: "2024-01-28T09:45:00Z",
		closedAt: "2024-01-28T14:15:00Z",
		notes: "Downtrend continuation",
		position: 100,
		stopLoss: 64.0,
		takeProfit: 60.0,
		riskRewardRatio: 1.9,
		fees: 1.75,
		strategy: "Trend Following",
		timeframe: "2H",
		setupQuality: 4,
		emotionalState: 4,
	},
	{
		id: "15",
		symbol: "UBER",
		type: "long",
		status: "breakeven",
		entryPrice: 68.25,
		exitPrice: 68.3,
		pnl: 5.0,
		openedAt: "2024-01-29T10:30:00Z",
		closedAt: "2024-01-29T11:45:00Z",
		notes: "Choppy price action",
		position: 100,
		stopLoss: 67.0,
		takeProfit: 70.0,
		riskRewardRatio: 1.6,
		fees: 1.5,
		strategy: "Momentum",
		timeframe: "15m",
		setupQuality: 2,
		emotionalState: 3,
	},
	{
		id: "16",
		symbol: "COIN",
		type: "long",
		status: "won",
		entryPrice: 124.5,
		exitPrice: 131.75,
		pnl: 725.0,
		openedAt: "2024-01-30T09:30:00Z",
		closedAt: "2024-01-30T16:00:00Z",
		notes: "Crypto market rally",
		position: 100,
		stopLoss: 120.0,
		takeProfit: 132.0,
		riskRewardRatio: 1.8,
		fees: 2.0,
		strategy: "Sector Momentum",
		timeframe: "1D",
		setupQuality: 5,
		emotionalState: 5,
	},
	{
		id: "17",
		symbol: "SQ",
		type: "short",
		status: "open",
		entryPrice: 72.4,
		exitPrice: null,
		pnl: null,
		openedAt: "2024-01-31T11:00:00Z",
		closedAt: null,
		notes: "Bearish pattern",
		position: 150,
		stopLoss: 74.0,
		takeProfit: 69.0,
		riskRewardRatio: 1.7,
		fees: 2.25,
		strategy: "Technical",
		timeframe: "4H",
		setupQuality: 3,
		emotionalState: 4,
	},
	{
		id: "18",
		symbol: "PLTR",
		type: "long",
		status: "won",
		entryPrice: 16.8,
		exitPrice: 17.45,
		pnl: 325.0,
		openedAt: "2024-02-01T09:45:00Z",
		closedAt: "2024-02-01T15:30:00Z",
		notes: "AI sector strength",
		position: 500,
		stopLoss: 16.4,
		takeProfit: 17.5,
		riskRewardRatio: 1.75,
		fees: 3.0,
		strategy: "Sector Momentum",
		timeframe: "1H",
		setupQuality: 4,
		emotionalState: 4,
	},
	{
		id: "19",
		symbol: "SNOW",
		type: "short",
		status: "lost",
		entryPrice: 205.75,
		exitPrice: 209.3,
		pnl: -355.0,
		openedAt: "2024-02-02T10:15:00Z",
		closedAt: "2024-02-02T14:45:00Z",
		notes: "Stopped out on reversal",
		position: 100,
		stopLoss: 209.5,
		takeProfit: 198.0,
		riskRewardRatio: 2.1,
		fees: 2.0,
		strategy: "Mean Reversion",
		timeframe: "30m",
		setupQuality: 2,
		emotionalState: 3,
	},
	{
		id: "20",
		symbol: "CRM",
		type: "long",
		status: "open",
		entryPrice: 278.9,
		exitPrice: null,
		pnl: null,
		openedAt: "2024-02-03T09:30:00Z",
		closedAt: null,
		notes: "Bullish flag pattern",
		position: 100,
		stopLoss: 275.0,
		takeProfit: 286.0,
		riskRewardRatio: 2.3,
		fees: 1.75,
		strategy: "Technical",
		timeframe: "2H",
		setupQuality: 4,
		emotionalState: 5,
	},
];

export default function Page() {
	return (
		<div className="flex flex-1 flex-col min-w-0">
			<div className="flex flex-col flex-1 min-h-0 relative">
				<header>
					<div className="flex items-center justify-stretch pe-4 min-h-14 border-b ps-4">
						<div>
							<h2 className="font-semibold text-sm me-4">Contacts</h2>
						</div>
						<div className="flex flex-1 justify-end">
							<div>
								<Input placeholder="Search by ticker..." />
							</div>
							<div className="ms-2 flex items-center gap-2">
								<Button>Create trade</Button>
								<ImportTransactionsSheet />
							</div>
						</div>
					</div>
					<div className="py-2 ps-4 pe-4 border-b">
						<div className="flex justify-end gap-2">
							{/* <div className="border text-xs flex items-center justify-center px-2 rounded-md">
								All - Leads - Customers
							</div> */}
							<ToggleGroup
								variant="outline"
								className="inline-flex gap-0 -space-x-px rounded-lg"
								type="single"
							>
								<ToggleGroupItem
									className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
									value="left"
									size="sm"
								>
									All
								</ToggleGroupItem>
								<ToggleGroupItem
									className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
									value="center"
									size="sm"
								>
									Open
								</ToggleGroupItem>
								<ToggleGroupItem
									className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
									value="right"
									size="sm"
								>
									Closed
								</ToggleGroupItem>
							</ToggleGroup>
							<Button variant="outline" size="sm">
								<Icons.FunnelIcon />
								Filter
							</Button>
							<div className="ms-2 flex-1 place-self-stretch" />
							<Button variant="outline" size="sm">
								<Icons.AdjustmentHorizontalIcon />
								Display
							</Button>
						</div>
					</div>
				</header>
				<div className="flex-1 overflow-y-auto p-0">
					<div className="my-0 mx-auto min-h-full h-px max-w-full">
						<div className="flex flex-col flex-1 h-full max-w-full">
							<div className="h-full w-full overflow-auto">
								<DataTable data={trades} columns={columns} />
							</div>
							<div className="sticky z-[1] bg-background border-t bottom-0 flex flex-row text-sm pe-4 ps-4 py-2">
								<div className="w-full gap-2 relative flex flex-row items-center justify-start">
									<p>Page</p>
									<Input placeholder="1" className="w-20" />
									<p>of 5</p>
								</div>
								<div className="inline-flex ms-2 gap-2">
									<Button variant="outline" size="sm">
										Previous
									</Button>
									<Button variant="outline" size="sm">
										Next
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
